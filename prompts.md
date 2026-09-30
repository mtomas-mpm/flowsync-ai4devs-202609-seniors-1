# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonet 5
**Herramienta:** Claude Code

```
Como experto escribiendo specs, me puedes escribir la spec de lo que el sistema hace hoy y déjala en un archivo versionado del proyecto en docs/spec-viva, no en el chat.

La spec debe incluir las dos capas, y solo ese vertical. Lo que pasa por la API y lo que se ve en pantalla, y nada que no sea cuentas y acceso. Nada más.

## Formato

- Arriba, un `## Purpose` de una o dos frases: para qué existe esta capability.
- Debajo, `## Requirements`, y colgando de él `### Requirement`: en los que el sistema SHALL hacer algo.
- Bajo cada requisito, al menos un `#### Scenario:` de cuatro almohadillas, con dos viñetas: **WHEN** y **THEN**. No hay casilla para el GIVEN: la precondición se mete dentro del WHEN.
- En castellano, salvo las mayúsculas de la RFC.
- Y tres reglas duras, que son las que separan este ejercicio de escribir documentación:
  - Nada de ADDED, MODIFIED ni REMOVED. Eso es el vocabulario de un delta, y esto no es un delta: es la verdad actual del sistema. Si tu archivo tiene una de esas secciones, has escrito otra cosa.
  - Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
  - No toques el código. Ni siquiera para arreglar lo que encuentres, y sobre todo para eso: lo que encuentres es material de la parte B.
  ```

**Qué salió:** 
I wrote docs/spec-viva/cuentas-y-acceso.md covering the accounts/access vertical: signup, login, profile lookup, logout, session persistence, and route guarding — both the API contract (verified live against the running backend: status codes, response shapes, error rules) and the screen behavior (forms, messages, redirects).



---

## Prompt 2

**Modelo:** Sonet 5
**Herramienta:** Claude Code

```
¿Cuántos requisitos has escrito? Sólo dame el número.
```

**Qué salió:** 
7

---

## Prompt 3

**Modelo:** Sonet 5
**Herramienta:** Claude Code

```
Enumeralos
```

**Qué salió:** 
```
1. Creación de una cuenta nueva
2. Inicio de sesión con email y contraseña
3. Consulta de los datos de la cuenta activa
4. Cierre de sesión
5. Persistencia de la sesión entre recargas
6. Acceso a las pantallas según el estado de la sesión

Son 6, no 7 — corrijo mi respuesta anterior.
```



---

## Prompt 4

**Modelo:** Sonet 5 xhigh
**Herramienta:** Claude Code

```
¿Puedes indicarme incoherencias que te hayan aparecido al escribirla? Una línea cada una, con dónde se ve. No las busques a propósito: aparecen solas, porque una regla que se cumple en casi todas partes canta en cuanto intentas escribirla como si se cumpliera siempre.
```

**Qué salió:** 
```
- El envoltorio { data } que cumple el resto de la API se rompe en cualquier error (400/401/422 responden { errors: [...] } a secas) — visible en los Scenarios de error de los cuatro primeros Requirements.
- fullName se presenta como opcional en pantalla, pero la clave sigue siendo obligatoria en la petición (solo el valor puede ser null) — Requirement "Creación de una cuenta nueva", Scenario "El nombre completo es opcional".
- El patrón "cada error va bajo su campo" no aplica al 400 de credenciales inválidas, que no trae field y siempre cae en el aviso general — Requirement "Inicio de sesión con email y contraseña", Scenario "Aviso de credenciales incorrectas".
- "Cerrar sesión borra el token guardado" deja de cumplirse justo cuando el servidor no responde al validar una sesión: ahí el token se conserva a propósito — Requirement "Persistencia de la sesión entre recargas", Scenario "Servidor inalcanzable al validar la sesión guardada".
- El botón "Cerrar sesión" da a entender que siempre funciona, pero la API que hay detrás exige un token válido y puede responder 401; la pantalla lo tapa ignorando el resultado de esa llamada — Requirement "Cierre de sesión", Scenario "Cerrar sesión desde la pantalla de la cuenta".
```


---

## Prompt 5

**Modelo:** Sonet 5 xhigh
**Herramienta:** Claude Code

```
 Lo que no supiste decidir si era un bug o el contrato. Al menos una, y en una frase, qué dos lecturas se contradecían. Esta es la lista que importa. No es lo que estaba mal: es lo que podría estar bien o mal según a quién le preguntes, y no había forma de decidirlo leyendo el código.
```

**Qué salió:** 
```

```


