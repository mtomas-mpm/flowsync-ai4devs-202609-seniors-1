# Parte A: La spec

## Purpose

Permitir que una persona cree una cuenta, inicie sesión, consulte los datos de su cuenta y cierre sesión, y que la aplicación recuerde y proteja esa sesión mientras navega por la pantalla.

## Requirements

### Requirement: Creación de una cuenta nueva
El sistema SHALL permitir crear una cuenta a partir de un email, una contraseña con su confirmación y, opcionalmente, un nombre completo, y SHALL abrir sesión automáticamente sobre la cuenta recién creada.

#### Scenario: Alta con datos válidos
- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName`, `email`, `password` y `passwordConfirmation` válidos y con un email que no existe todavía
- **THEN** responde 200 con `{ "data": { "user": {...}, "token": "..." } }`, donde `user` incluye `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y `token` es una cadena opaca lista para usarse como `Authorization: Bearer`

#### Scenario: El nombre completo es opcional
- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName` en `null` (la clave debe viajar igualmente) y el resto de campos válidos
- **THEN** responde 200 y la cuenta queda creada sin nombre; el campo `initials` de la respuesta se calcula igualmente, a partir del email, como dos letras mayúsculas

#### Scenario: Email ya registrado
- **WHEN** se envía `POST /api/v1/auth/signup` con un `email` que ya pertenece a otra cuenta
- **THEN** responde 422 con `{ "errors": [{ "message": "...", "rule": "database.unique", "field": "email" }] }` y no crea ninguna cuenta

#### Scenario: Confirmación de contraseña distinta
- **WHEN** `password` y `passwordConfirmation` no coinciden (y ambos tienen longitud válida)
- **THEN** responde 422 con un error de regla `sameAs` sobre el campo `passwordConfirmation`, y no crea ninguna cuenta

#### Scenario: Contraseña fuera del rango permitido
- **WHEN** `password` o `passwordConfirmation` tienen menos de 8 caracteres o más de 32
- **THEN** responde 422 con un error de regla `minLength` o `maxLength` sobre el campo correspondiente

#### Scenario: Email con formato inválido
- **WHEN** `email` no tiene forma de dirección de correo
- **THEN** responde 422 con un error de regla `email` sobre el campo `email`

#### Scenario: Faltan campos obligatorios
- **WHEN** se envía `POST /api/v1/auth/signup` sin alguna de las claves `fullName`, `email`, `password` o `passwordConfirmation`
- **THEN** responde 422 con un error de regla `required` por cada clave ausente

#### Scenario: Pantalla de registro
- **WHEN** una persona sin sesión abre `/register`
- **THEN** ve un formulario con los campos «Nombre completo (opcional)», «Email», «Contraseña» (con la ayuda «Entre 8 y 32 caracteres.») y «Repite la contraseña», un botón «Crear cuenta» y un enlace «¿Ya tienes cuenta? Inicia sesión» hacia `/login`

#### Scenario: Aviso local de contraseñas que no coinciden
- **WHEN** en el formulario de registro se escribe una «Contraseña» y una «Repite la contraseña» distintas y se pulsa «Crear cuenta»
- **THEN** la pantalla muestra «Las contraseñas no coinciden.» bajo el campo «Repite la contraseña» sin llegar a contactar con el servidor

#### Scenario: Errores del servidor bajo cada campo
- **WHEN** el servidor rechaza el alta con errores de validación sobre `fullName`, `email`, `password` o `passwordConfirmation`
- **THEN** la pantalla muestra el mensaje correspondiente, ya traducido al castellano, justo bajo cada campo afectado (por ejemplo, un email duplicado muestra «Ese email ya está registrado. Inicia sesión en su lugar.» bajo «Email»)

#### Scenario: Alta correcta lleva a la cuenta
- **WHEN** el alta se completa con éxito desde la pantalla de registro
- **THEN** la aplicación abre sesión con la cuenta creada y pasa a mostrar la pantalla de la cuenta (`/profile`)

### Requirement: Inicio de sesión con email y contraseña
El sistema SHALL permitir iniciar sesión con un email y una contraseña existentes, devolviendo un token de acceso, y SHALL rechazar credenciales que no correspondan a ninguna cuenta.

#### Scenario: Inicio de sesión con credenciales correctas
- **WHEN** se envía `POST /api/v1/auth/login` con el `email` y `password` de una cuenta existente
- **THEN** responde 200 con `{ "data": { "user": {...}, "token": "..." } }`, con la misma forma que la respuesta del alta

#### Scenario: Credenciales incorrectas
- **WHEN** se envía `POST /api/v1/auth/login` con un `email` y `password` que no coinciden con ninguna cuenta (email inexistente o contraseña errónea)
- **THEN** responde 400 con `{ "errors": [{ "message": "Invalid user credentials" }] }`, sin indicar qué campo ha fallado

#### Scenario: Faltan campos obligatorios
- **WHEN** se envía `POST /api/v1/auth/login` sin `email` o sin `password`
- **THEN** responde 422 con un error de regla `required` por cada clave ausente

#### Scenario: Pantalla de inicio de sesión
- **WHEN** una persona sin sesión abre `/login`
- **THEN** ve un formulario con los campos «Email» y «Contraseña», un botón «Entrar» y un enlace «¿Aún no tienes cuenta? Crea una» hacia `/register`

#### Scenario: Aviso de credenciales incorrectas
- **WHEN** el servidor rechaza el inicio de sesión por credenciales incorrectas
- **THEN** la pantalla muestra el aviso general «El email o la contraseña no son correctos.» sobre el formulario, sin marcar ningún campo en particular

#### Scenario: Inicio de sesión correcto lleva a la cuenta
- **WHEN** el inicio de sesión se completa con éxito desde la pantalla de login
- **THEN** la aplicación abre sesión y pasa a mostrar la pantalla de la cuenta (`/profile`)

### Requirement: Consulta de los datos de la cuenta activa
El sistema SHALL exponer los datos de la cuenta autenticada únicamente a quien presente un token de acceso válido, y SHALL mostrarlos en una pantalla dentro de la aplicación.

#### Scenario: Consulta con un token válido
- **WHEN** se envía `GET /api/v1/account/profile` con la cabecera `Authorization: Bearer <token>` de una sesión activa
- **THEN** responde 200 con `{ "data": { "id", "fullName", "email", "createdAt", "updatedAt", "initials" } }` de esa cuenta

#### Scenario: Consulta sin token o con un token inválido
- **WHEN** se envía `GET /api/v1/account/profile` sin cabecera `Authorization`, o con un token que no existe o ya no es válido
- **THEN** responde 401 con `{ "errors": [{ "message": "Unauthorized access" }] }`

#### Scenario: Pantalla de la cuenta
- **WHEN** una persona con sesión activa ve `/profile`
- **THEN** la pantalla muestra un avatar con las iniciales de la cuenta, el nombre completo (o «Sin nombre» si no se indicó ninguno), el email, la fecha de alta en formato largo en castellano (por ejemplo «30 de septiembre de 2026») bajo «Miembro desde», y un botón «Cerrar sesión»

### Requirement: Cierre de sesión
El sistema SHALL invalidar el token de acceso activo cuando se cierra sesión, de forma que deje de servir para autenticar peticiones posteriores.

#### Scenario: Cierre de sesión con un token válido
- **WHEN** se envía `POST /api/v1/account/logout` con la cabecera `Authorization: Bearer <token>` de una sesión activa
- **THEN** responde 200 con `{ "message": "Logged out successfully" }`, y ese mismo token deja de aceptarse en peticiones posteriores (una consulta posterior a la cuenta con ese token responde 401)

#### Scenario: Cierre de sesión sin token válido
- **WHEN** se envía `POST /api/v1/account/logout` sin cabecera `Authorization`, o con un token que no existe o ya no es válido
- **THEN** responde 401 con `{ "errors": [{ "message": "Unauthorized access" }] }`

#### Scenario: Cerrar sesión desde la pantalla de la cuenta
- **WHEN** se pulsa «Cerrar sesión» en `/profile`
- **THEN** el botón pasa a mostrar «Cerrando sesión…» y queda deshabilitado, la sesión local se cierra de inmediato (incluso si la petición al servidor tarda o falla) y la aplicación pasa a mostrar la pantalla de inicio de sesión (`/login`)

### Requirement: Persistencia de la sesión entre recargas
El sistema SHALL recordar la sesión de una persona entre recargas de la página mientras el token siga siendo válido, y SHALL cerrarla si el servidor lo rechaza.

#### Scenario: Sesión guardada y todavía válida
- **WHEN** se recarga la aplicación con una sesión iniciada previamente
- **THEN** la aplicación consulta los datos de la cuenta con el token guardado antes de dar la sesión por buena, y si el servidor lo acepta, muestra a la persona ya autenticada sin pedirle que vuelva a iniciar sesión

#### Scenario: Sesión guardada pero rechazada por el servidor
- **WHEN** se recarga la aplicación con un token guardado que el servidor ya no reconoce (caducado o revocado)
- **THEN** la aplicación olvida ese token, trata a la persona como no autenticada y, si llega a `/login`, muestra el aviso «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: Servidor inalcanzable al validar la sesión guardada
- **WHEN** se recarga la aplicación con un token guardado y el servidor no responde (caído o sin red)
- **THEN** la aplicación no borra el token guardado, pero trata a la persona como no autenticada en esa carga y muestra en `/login` un aviso explicando que no se ha podido restaurar la sesión

#### Scenario: Pantalla de carga mientras se valida la sesión
- **WHEN** la aplicación está comprobando un token guardado contra el servidor
- **THEN** se muestra una pantalla de carga en lugar de la pantalla final o de una redirección, hasta que la comprobación termina

### Requirement: Acceso a las pantallas según el estado de la sesión
El sistema SHALL mostrar únicamente las pantallas de cuenta (`/profile`) a quien tenga sesión activa, y únicamente las pantallas de acceso (`/login`, `/register`) a quien no la tenga.

#### Scenario: Pantalla de cuenta sin sesión
- **WHEN** una persona sin sesión activa intenta abrir `/profile`
- **THEN** la aplicación la lleva a `/login`

#### Scenario: Pantallas de acceso con sesión activa
- **WHEN** una persona con sesión activa intenta abrir `/login` o `/register`
- **THEN** la aplicación la lleva a `/profile`

#### Scenario: Dirección desconocida
- **WHEN** se abre una dirección dentro de la aplicación que no corresponde a ninguna pantalla conocida
- **THEN** la aplicación lleva a `/profile`, y desde ahí, si no hay sesión activa, continúa hasta `/login`


# Parte B

## 1. Cuántos requisitos escribió el agente, y cuántos comprobaste tú abriendo el código

6 - 3

## 2. Las incoherencias que aparecieron al escribirla:

- El envoltorio { data } que cumple el resto de la API se rompe en cualquier error (400/401/422 responden { errors: [...] } a secas) — visible en los Scenarios de error de los cuatro primeros Requirements.
- fullName se presenta como opcional en pantalla, pero la clave sigue siendo obligatoria en la petición (solo el valor puede ser null) — Requirement "Creación de una cuenta nueva", Scenario "El nombre completo es opcional".
- El patrón "cada error va bajo su campo" no aplica al 400 de credenciales inválidas, que no trae field y siempre cae en el aviso general — Requirement "Inicio de sesión con email y contraseña", Scenario "Aviso de credenciales incorrectas".
- "Cerrar sesión borra el token guardado" deja de cumplirse justo cuando el servidor no responde al validar una sesión: ahí el token se conserva a propósito — Requirement "Persistencia de la sesión entre recargas", Scenario "Servidor inalcanzable al validar la sesión guardada".
- El botón "Cerrar sesión" da a entender que siempre funciona, pero la API que hay detrás exige un token válido y puede responder 401; la pantalla lo tapa ignorando el resultado de esa llamada — Requirement "Cierre de sesión", Scenario "Cerrar sesión desde la pantalla de la cuenta".

## 3. Lo que no supiste decidir si era un bug o el contrato.

- El 400 de credenciales inválidas no lleva field (Requirement "Inicio de sesión...", Scenario "Credenciales incorrectas"): puede ser una decisión de seguridad deliberada para no revelar si el email existe, o puede ser simplemente la excepción por defecto de Adonis sin personalizar, y el código no dice cuál de las dos es.
- fullName es .nullable() pero no .optional() en el validador (Requirement "Creación de una cuenta nueva", Scenario "El nombre completo es opcional"): puede ser un contrato deliberado que distingue "sin nombre" (null explícito) de "campo no enviado", o puede ser que a nadie se le ocurrió que un campo opcional también debería poder omitirse, y el validador no se pronuncia sobre cuál de las dos lecturas es la correcta.
