import { Router } from 'express';

export default () => {
  const api = Router();

  /*
   * List the most recent logs.
   */
  api.get('/', (req, res, next) => {
    req.auth0.logs
      .getAll({
        q: 'NOT type: sapi AND NOT type:fapi',
        include_totals: true,
        sort: 'date:-1',
        per_page: 20,
        page: req.query.page || 0,
        fields: 'type,date,client_name,user_name,description,connection'
      })
      .then(logs => res.json(logs))
      .catch(next);
  });

  /*
   * List a single log record.
   */
  api.get('/:id', (req, res, next) => {
    req.auth0.logs.get({ id: req.params.id })
      .then(log => {
        if (log && (log.type === 'fapi' || log.type === 'sapi')) {
          throw new Error('Invalid log record.');
        }

        return log;
      })
      .then(log => res.json({ log }))
      .catch(next);
  });

  return api;
};
