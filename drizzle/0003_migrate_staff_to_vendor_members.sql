-- Migration: Unifier Staff et Vendor Members
-- Objectif: Migrer tous les utilisateurs staff vers le système vendor_members avec Bridge comme vendor officiel

-- 1. S'assurer que le vendor Bridge existe (isBridgeOfficial = true)
-- Si le vendor Bridge n'existe pas, il doit être créé manuellement ou via le seed

-- 2. Récupérer l'ID du vendor Bridge
DO $$
DECLARE
    bridge_vendor_id UUID;
    staff_user RECORD;
BEGIN
    -- Trouver le vendor Bridge officiel
    SELECT id INTO bridge_vendor_id
    FROM vendors
    WHERE "isBridgeOfficial" = true
    LIMIT 1;

    -- Vérifier que le vendor Bridge existe
    IF bridge_vendor_id IS NULL THEN
        RAISE EXCEPTION 'Le vendor Bridge officiel (isBridgeOfficial=true) n existe pas. Veuillez d abord créer le vendor Bridge.';
    END IF;

    RAISE NOTICE 'Vendor Bridge ID: %', bridge_vendor_id;

    -- 3. Migrer les users staff existants vers vendor_members
    -- Mapping des rôles:
    --   user.role = 'admin'    → vendor_member.role = 'admin'
    --   user.role = 'manager'  → vendor_member.role = 'manager'
    --   user.role = 'staff'    → vendor_member.role = 'operator'
    --   user.role = 'operator' → vendor_member.role = 'operator'

    FOR staff_user IN
        SELECT id, role, email, name
        FROM users
        WHERE role != 'customer'
          AND role IS NOT NULL
    LOOP
        -- Déterminer le rôle vendor_member
        DECLARE
            vendor_role VARCHAR(50);
        BEGIN
            CASE staff_user.role
                WHEN 'admin' THEN vendor_role := 'admin';
                WHEN 'manager' THEN vendor_role := 'manager';
                WHEN 'staff' THEN vendor_role := 'operator';
                WHEN 'operator' THEN vendor_role := 'operator';
                ELSE vendor_role := 'operator'; -- Fallback
            END CASE;

            -- Insérer le vendor_member (ignorer si existe déjà)
            INSERT INTO vendor_members ("vendorId", "userId", role, "createdAt", "updatedAt")
            VALUES (bridge_vendor_id, staff_user.id, vendor_role, NOW(), NOW())
            ON CONFLICT ("vendorId", "userId") DO UPDATE
            SET role = EXCLUDED.role,
                "updatedAt" = NOW();

            RAISE NOTICE 'Migré: % (%) -> rôle %', staff_user.email, staff_user.name, vendor_role;
        END;
    END LOOP;

    RAISE NOTICE 'Migration terminée avec succès!';
END $$;

-- 4. Vérification: Afficher les membres du vendor Bridge
SELECT
    vm.id,
    vm.role as "vendorRole",
    u.email,
    u.name,
    u.role as "userRole",
    v."companyName"
FROM vendor_members vm
JOIN users u ON vm."userId" = u.id
JOIN vendors v ON vm."vendorId" = v.id
WHERE v."isBridgeOfficial" = true
ORDER BY
    CASE vm.role
        WHEN 'admin' THEN 1
        WHEN 'manager' THEN 2
        WHEN 'operator' THEN 3
    END;
