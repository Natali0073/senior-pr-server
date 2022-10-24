const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit, dataPropName = 'data') => {
  const { count: totalItems, rows } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, totalPages, currentPage, [dataPropName]: rows };
};

const utils = {
  getPagination: getPagination,
  getPagingData: getPagingData,
};
module.exports = utils;