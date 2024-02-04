import { AxiosError } from "axios";
import { DateTime } from "luxon";
import type { NextApiRequest, NextApiResponse } from "next";
import otp from "../../../services/otp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { params } = req.query;

  if (params.length > 2) {
    res.status(404).json(params);
    return;
  }

  const [stopId, date] = params as string[];

  if (stopId && !date) {
    const date = DateTime.now().toSQLDate();
    try {
      const resp = await otp.get(
        `/otp/routers/default/index/stops/MetroCar:${stopId}/stoptimes/${date}`
      );
      res.status(200).json(resp.data);
      return;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response) {
          res.status(e.response.status).end();
          return;
        }

        res.status(503).end();
        return;
      }
    }
  }

  try {
    const resp = await otp.get(
      `/otp/routers/default/index/stops/MetroCar:${stopId}/stoptimes/${date}`
    );

    res.json(resp.data);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response) {
        res.status(e.response.status).end();
        return;
      }

      res.status(503).end();
    }
  }
}
