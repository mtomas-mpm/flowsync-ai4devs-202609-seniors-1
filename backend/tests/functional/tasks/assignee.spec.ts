import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable identificable, la tarea que no
 * filtra datos de cuenta y el responsable sin nombre.
 *
 * Cada scenario se comprueba por las dos lecturas que devuelven tareas: la
 * suelta (`GET /tasks/:id`) y la lista (`GET /tasks`).
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const hoy = '2026-10-07'

  async function sesion(client: any, email = 'mirón@example.com') {
    await User.create({ fullName: 'Quien Mira', email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  async function tareaDe(fullName: string | null, email = 'ada@example.com') {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })

    return Task.create({ title: 'Escribir el motor', status: 'pending', assigneeId: responsable.id })
  }

  async function leer(client: any, token: string, id: number) {
    const suelta = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    return {
      suelta: suelta.body().data.assignee,
      lista: lista.body().data.find((t: { id: number }) => t.id === id).assignee,
    }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace')

    const { suelta, lista } = await leer(client, token, tarea.id)

    for (const assignee of [suelta, lista]) {
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('la tarea no incluye el email ni otro dato de acceso del responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace')

    const { suelta, lista } = await leer(client, token, tarea.id)

    for (const assignee of [suelta, lista]) {
      assert.notProperty(assignee, 'email')
      assert.notProperty(assignee, 'password')
      assert.notInclude(JSON.stringify(assignee), 'ada@example.com')
    }
  })

  test('un responsable sin nombre llega con nombre nulo e iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe(null)

    const { suelta, lista } = await leer(client, token, tarea.id)

    for (const assignee of [suelta, lista]) {
      assert.isNull(assignee.fullName)
      assert.equal(assignee.initials, 'AE')
    }
  })
})
