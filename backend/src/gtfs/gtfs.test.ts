import { db } from '../common/db';
import { getGTFSCSV } from './gtfs';
import { deleteTestDataQuery, testDataQuery } from '../test_helper/helpers';

beforeAll(() => db.none(testDataQuery));
afterAll(() => db.none(deleteTestDataQuery));

it('makes gtfs correctly', async () => {
  const data = await getGTFSCSV();

  data.forEach((csv) => {
    expect(csv.content).toMatchSnapshot(csv.name);
  });
});
