import { ApiError, handleAssistantMessage, handleQuizGenerate, handleQuizGrade } from './apiHandler.js'

const MAX_BODY_SIZE = 16 * 1024

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    let oversized = false
    req.on('data', (chunk) => {
      if (oversized) return
      data += chunk
      if (data.length > MAX_BODY_SIZE) {
        oversized = true
        data = ''
        reject(new ApiError(413, 'Request body is too large.'))
      }
    })
    req.on('end', () => {
      if (oversized) return
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        reject(new ApiError(400, 'Request body must contain valid JSON.'))
      }
    })
    req.on('error', reject)
  })
}

export function skillsetuApiPlugin() {
  return {
    name: 'skillsetu-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]

        if (!url?.startsWith('/api/')) {
          return next()
        }

        const sendJson = (statusCode, payload) => {
          res.statusCode = statusCode
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(payload))
        }

        try {
          if (req.method === 'POST' && url === '/api/assistant/message') {
            const body = await readJsonBody(req)
            const result = await handleAssistantMessage(body)
            return sendJson(200, result)
          }

          if (req.method === 'POST' && url === '/api/quiz/generate') {
            const body = await readJsonBody(req)
            const result = await handleQuizGenerate(body)
            return sendJson(200, result)
          }

          if (req.method === 'POST' && url === '/api/quiz/grade') {
            const body = await readJsonBody(req)
            const result = await handleQuizGrade(body)
            return sendJson(200, result)
          }

          return sendJson(404, { error: 'SkillSetu API endpoint not found' })
        } catch (err) {
          const statusCode = err instanceof ApiError ? err.statusCode : 500
          if (statusCode >= 500) console.error('API middleware error:', err)
          return sendJson(statusCode, {
            error: statusCode >= 500 ? 'The request could not be completed.' : err.message,
          })
        }
      })
    },
  }
}
