export const toBuffer = (data: any) => {
  const json_data = JSON.stringify(data)
  return Buffer.from(json_data, 'utf8');
}

export const toObject = (buffer: any) => {
  const json_data = buffer.toString('utf8');
  return JSON.parse(json_data);
}