// This function spits out something like...
// `UPDATE exercises SET name=$1, amount=$2`
// so that WHERE clauses can be appended after.
export const buildUpdateQueryBase = async (tableName, updates) => {
  const clauses = [];
  let query = `UPDATE ${tableName} SET`;
  let index = 0;
  for (let columnName in updates) {
    let newValue = updates[columnName];
    if (!newValue) {
      continue;
    }
    index++;
    // Escape keywords.
    if (columnName === 'order') {
      columnName = '"order"';
    }
    clauses.push(`${columnName}=$${index}`);
  }
  return `${query} ${clauses.join(', ')}`;
};
