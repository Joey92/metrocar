import { join } from 'path';
import { QueryFile } from 'pg-promise';

function sql(file) {
  const fullPath = join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
}

export const testDataQuery = sql('./test_data.sql');
export const deleteTestDataQuery = sql('./clear_test_data.sql');
