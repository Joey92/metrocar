import { RequestHandler } from 'express';
import _ from 'lodash';
import axios from 'axios';
import { OTP_URL } from './common/config';

export const getStopRoutesHandler: RequestHandler = (req, res) => {
  const { id: stopId } = req.params;
  axios
    .get(
      `${OTP_URL}/otp/routers/default/index/stops/MetroCar:${stopId}/patterns`,
    )
    .then((resp) => res.send(resp.data))
    .catch((resp) => res.sendStatus(resp.status));
};

export const getStopDeparturesHandler: RequestHandler = async (req, res) => {
  const { id: stopId, date } = req.params;
  const optResp = await axios.get(
    `${OTP_URL}/otp/routers/default/index/stops/MetroCar:${stopId}/stoptimes/${date}`,
  );

  res.send(optResp.data);
};
