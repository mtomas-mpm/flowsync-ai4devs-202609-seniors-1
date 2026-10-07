# Parte A.1:  La matriz de trazabilidad

Scenarios en el requisito: 3 · Cubiertos: 0

| Scenario | Test que lo cubre | Estado | Qué te faltó |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es «Ada Lovelace», su `assignee` trae el nombre y las iniciales | | No cubierto | |
| Al obtener cualquier tarea, suelta o en la lista, su `assignee` no incluye el email ni otro dato de acceso | | No cubierto | |
| Si el responsable se registró sin nombre, su nombre llega nulo y sus iniciales siguen llegando | | No cubierto | `initials.spec.ts` («sin nombre, las iniciales salen del email») comprueba el login, no el `assignee` de una tarea |


# Parte B:  Las tres líneas

## 1. Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban.

3 0

## 2. El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.

En el scenario 3 («Responsable sin nombre») no supe si faltaba un test o faltaba la regla: el único test parecido, sin nombre, las iniciales salen del email, comprueba el login y no el assignee de una tarea, y la spec dice que las iniciales siguen llegando «sin recurrir a su email» pero no define cuáles son, así que el valor esperado (AE) lo tuve que sacar del código y no de la spec.

## 3. Algo que el scenario no determinaba y tuviste que decidir al escribir el test

Al escribir el test del scenario 3 tuve que decidir las iniciales esperadas, porque el scenario solo dice que «siguen llegando» y no cuáles son: puse AE para ada@example.com, copiando lo que ya hace el código y afirma el test de auth, así que el test fija el comportamiento actual (incluidas sus rarezas) y no una regla de la spec.