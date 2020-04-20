export function toString(d?: Date) {
  if(!d) return '';
  let dd = ''+ d?.getDate();
  let mm = '' + (d?.getMonth()+1);
  if (dd.length === 1) dd = '0' + dd;
  if (mm.length === 1) mm = '0' + mm;
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function dayDiff(d1: Date, d2: Date) {
  return Math.round((Number(d2) - Number(d1)) / (24 * 60 * 60 * 1000));
}
