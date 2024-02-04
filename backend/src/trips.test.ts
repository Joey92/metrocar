import { db } from './common/db';
import { getGTFSShapeFromPoints } from './trips';
import { deleteTestDataQuery, testDataQuery } from './test_helper/helpers';

beforeAll(() => db.none(testDataQuery));
afterAll(() => db.none(deleteTestDataQuery));

it('makes shape correctly', async () => {
  const points = [
    [13.576265, 52.579501],
    [13.424863815307619, 52.52379372545992],
    [13.372711, 52.527128],
  ];

  const data = await getGTFSShapeFromPoints(points);

  expect(data).toMatchSnapshot();
});
