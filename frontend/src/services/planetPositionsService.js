import { httpService } from "./httpService";

export const getPlanets = async (date) => {
  const response = await httpService.get(`planet-positions?date=${date}`);

  return response.data;
};
