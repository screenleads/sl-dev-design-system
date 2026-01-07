# GitHub Actions - Despliegue Automático

## Configuración del NPM_TOKEN

⚠️ **IMPORTANTE:** npm requiere 2FA habilitado para generar tokens. Desde 2024, los tokens clásicos fueron revocados.

### 1. Habilitar 2FA en npm (REQUERIDO)

1. Ve a https://www.npmjs.com/settings/profile
2. Busca **"Two-Factor Authentication"**
3. Click **"Enable 2FA"**
4. Usa una app de autenticación (Google Authenticator, Authy, 1Password, etc.)
5. Guarda los códigos de recuperación en un lugar seguro

### 2. Generar Granular Access Token

1. Ve a https://www.npmjs.com/settings (sidebar → **"Access Tokens"**)
2. Click **"Generate New Token"** → **"Granular Access Token"**
3. Configura:
   - **Token name:** `GitHub Actions - sl-dev-components`
   - **Expiration:** 90 días (máximo permitido)
   - **Packages and scopes:**
     - Select packages → Busca `sl-dev-components`
     - Permissions: **Read and write**
4. Click **"Generate token"**
5. **COPIA EL TOKEN** (solo se muestra una vez)

### 3. Agregar el token a GitHub

1. Ve a: https://github.com/screenleads/sl-dev-design-system/settings/secrets/actions
2. Click **"New repository secret"**
3. Nombre: `NPM_TOKEN`
4. Valor: Pega el token generado
5. Click **"Add secret"**

⏰ **Recordatorio:** Los tokens expiran cada 90 días. Configura un recordatorio para renovarlo.

### 4. Trigger del workflow

El workflow se ejecuta automáticamente cuando:

- **Tags v*:** Creas un tag de versión (ej: `v0.1.0`) - **RECOMENDADO**
- **Manual:** Desde la pestaña "Actions" en GitHub

### 5. Publicar una nueva versión

```bash
# 1. Actualiza la versión
cd projects/sl-dev-components
# Edita package.json: "version": "0.1.1"

# 2. Commit cambios
git add .
git commit -m "chore: bump version to 0.1.1"
git push

# 3. Crear tag (esto dispara el workflow)
git tag v0.1.1
git push origin v0.1.1
```

## Troubleshooting

### Error: "E403 Forbidden"
- Verifica que el token NPM_TOKEN esté configurado correctamente
- Asegúrate de que el token tenga permisos de **escritura**

### Error: "Package already exists"
- Incrementa la versión en `projects/sl-dev-components/package.json`
- npm no permite sobrescribir versiones ya publicadas

### Build falla
- Ejecuta `npm run build sl-dev-components` localmente para verificar errores
- Revisa los logs en la pestaña "Actions" de GitHub
