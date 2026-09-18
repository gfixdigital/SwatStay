export function success<T>(data: T, message = "Request completed successfully") {
  return { success: true, message, data };
}

export function list<T>(data: T[], page = 1, limit = data.length, total = data.length) {
  return { success: true, message: "Records fetched successfully", data, meta: { page, limit, total, totalPages: limit ? Math.ceil(total / limit) : 0 } };
}
