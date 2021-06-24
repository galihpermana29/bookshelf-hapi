const { nanoid } = require('nanoid');
const books = require('./books');

//ADD books
const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;
	const id = nanoid(16);

	//generate time
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = readPage === pageCount ? true : false;

	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	books.push(newBook);
	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	} else {
		const response = h.response({
			status: 'error',
			message: 'Buku gagal ditambahkan',
		});
		response.code(500);
		return response;
	}
};

//GET ALL BOOKS
const getAllBookHandler = (request, h) => {
	let { name } = request.query;
	let { reading } = request.query;
	let { finished } = request.query;

	let filteredByName = [];
	let filteredByReading = [];
	let filteredByFinished = [];
	let filteredBooks = [];

	if (typeof name === 'string') {
		if (name !== undefined) {
			books.forEach((book) => {
				let bookName = book.name.toLowerCase();
				name = name.toLowerCase();
				if (bookName.includes(name)) {
					filteredByName.push({
						id: book.id,
						name: book.name,
						publisher: book.publisher,
					});
				}
			});
		}
		const response = h.response({
			status: 'success',
			data: {
				books: filteredByName,
			},
		});
		response.code(200);
		return response;
	}

	if (reading === '0') {
		filteredByReading = [];
		books.forEach((book) => {
			if (!book.reading) {
				filteredByReading.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});
		const response = h.response({
			status: 'success',
			data: {
				books: filteredByReading,
			},
		});
		response.code(200);
		return response;
	} else if (reading === '1') {
		filteredByReading = [];
		books.forEach((book) => {
			if (book.reading) {
				filteredByReading.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});
		const response = h.response({
			status: 'success',
			data: {
				books: filteredByReading,
			},
		});
		response.code(200);
		return response;
	}

	if (finished === '0') {
		filteredByFinished = [];
		books.forEach((book) => {
			if (!book.finished) {
				filteredByFinished.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});
		const response = h.response({
			status: 'success',
			data: {
				books: filteredByFinished,
			},
		});
		response.code(200);
		return response;
	} else if (finished === '1') {
		filteredByFinished = [];
		books.forEach((book) => {
			if (book.finished) {
				filteredByFinished.push({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				});
			}
		});
		const response = h.response({
			status: 'success',
			data: {
				books: filteredByFinished,
			},
		});
		response.code(200);
		return response;
	}

	if (books.length > 0) {
		books.forEach((book) => {
			filteredBooks.push({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			});
		});
		const response = h.response({
			status: 'success',
			data: {
				books: filteredBooks,
			},
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: 'success',
			data: {
				books: [],
			},
		});
		return response;
	}
};

//GET BY ID books
const getBookByIdHandler = (request, h) => {
	const { id } = request.params;
	const book = books.filter((book) => book.id === id)[0];

	if (book !== undefined) {
		const response = h.response({
			status: 'success',
			data: {
				book: book,
			},
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

//EDIT books
const editBookByIdHandler = (request, h) => {
	const { id } = request.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;
	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === id);

	if (index !== -1) {
		if (!name) {
			const response = h.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Mohon isi nama buku',
			});
			response.code(400);
			return response;
		} else if (readPage > pageCount) {
			const response = h.response({
				status: 'fail',
				message:
					'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
			});
			response.code(400);
			return response;
		} else {
			books[index] = {
				...books[index],
				name,
				year,
				author,
				summary,
				publisher,
				pageCount,
				readPage,
				reading,
				updatedAt,
			};
			const response = h.response({
				status: 'success',
				message: 'Buku berhasil diperbarui',
			});
			response.code(200);
			return response;
		}
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

//DELETE books
const deleteBookByIdHandler = (request, h) => {
	const { id } = request.params;

	const index = books.findIndex((book) => book.id === id);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

module.exports = {
	getAllBookHandler,
	addBookHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler,
};
