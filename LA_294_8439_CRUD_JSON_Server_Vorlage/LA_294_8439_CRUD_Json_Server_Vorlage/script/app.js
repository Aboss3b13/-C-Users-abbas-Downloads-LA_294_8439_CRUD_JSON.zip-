	const API_URL = "http://localhost:3000";

	// Simulated CRUD operation functions
	function createItem() {
	let app_el = document.getElementById("content");

	// Fetch current books to determine the next ID
	fetch(`${API_URL}/books`)
		.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`);
		}
		return response.json();
		})
		.then((books) => {
		// Find the next available ID by getting the max ID and adding 1 as a string
		const nextId = books.length > 0 ? (Math.max(...books.map(book => parseInt(book.id))) + 1).toString() : "0";

		// Create new book with the next available ID (as a string)
		const newBook = {
			title: "New Book",
			id: nextId,
		};

		// Send the new book data to the server
		fetch(`${API_URL}/books`, {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(newBook),
		})
			.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}
			return response.json();
			})
			.then((data) => {
			console.log("Erstellt:", data);
			})
			.catch((error) => {
			console.error("Fehler beim Erstellen:", error);
			});
		})
		.catch((error) => {
		console.error("Fehler beim Abrufen der Bücher:", error);
		});
	}

	function readItem() {
	let app_el = document.getElementById("content");
	fetch(`${API_URL}/books`)
		.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`);
		}
		return response.json();
		})
		.then((books) => {
		// Display books in the content element
		app_el.innerHTML = books
			.map((book) => `<p>${book.id}: ${book.title}</p>`)
			.join("");
		})
		.catch((error) => {
		console.error("Fehler beim Lesen:", error);
		});
	}

	function updateItem() {
		let app_el = document.getElementById("content");
		
		// The updated content to apply to the books
		let updatedBook = {
		  title: "Updated Book",
		};
	  
		// Fetch all books
		fetch(`${API_URL}/books`)
		  .then((response) => {
			if (!response.ok) {
			  throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}
			return response.json();
		  })
		  .then((books) => {
			// Sort books by ID (assuming higher ID is more recent)
			books.sort((a, b) => parseInt(b.id) - parseInt(a.id));
	  
			// Find the most recent book (with the highest ID)
			let bookToUpdate = books[0];
	  
			// Check if the most recent book is already updated (e.g., its title is "Updated Book")
			if (bookToUpdate.title === "Updated Book") {
			  console.log("Most recent book is already updated, updating the next one.");
			  // If the most recent one is updated, select the next one
			  bookToUpdate = books[1] || books[0]; // If there's no second book, fall back to the first one
			}
	  
			console.log("Book to update:", bookToUpdate);
	  
			// Perform the update operation
			return fetch(`${API_URL}/books/${bookToUpdate.id}`, {
			  method: "PUT",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify(updatedBook),
			});
		  })
		  .then((response) => {
			if (response.ok) {
			  console.log("Buch aktualisiert.");
			} else {
			  console.error("Buch konnte nicht aktualisiert werden. Status:", response.status);
			  return response.text().then((text) => {
				console.error("Antwort vom Server:", text);
			  });
			}
		  })
		  .catch((error) => {
			console.error("Fehler beim Aktualisieren:", error);
		  });
	  }
	  

	function deleteItem() {
	fetch(`${API_URL}/books`)
		.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`);
		}
		return response.json();
		})
		.then((books) => {
		if (books.length === 0) {
			console.error("Keine Bücher gefunden!");
			return;
		}

		// Sort books by ID in ascending order (treat ID as a string for comparison)
		books.sort((a, b) => parseInt(a.id) - parseInt(b.id));

		// Select the book with the highest ID (last in the sorted array)
		const bookToDelete = books[books.length - 1];
		console.log("Book to delete:", bookToDelete);

		// Delete the selected book
		return fetch(`${API_URL}/books/${bookToDelete.id}`, {
			method: "DELETE",
		});
		})
		.then((response) => {
		if (response.ok) {
			console.log("Buch gelöscht.");
		} else {
			console.error("Buch nicht gefunden oder konnte nicht gelöscht werden. Status:", response.status);
			return response.text().then((text) => {
			console.error("Antwort vom Server:", text);
			});
		}
		})
		.catch((error) => {
		console.error("Fehler beim Löschen:", error);
		});
	}

	// Event listeners for buttons
	const createButton = document.getElementsByClassName("create");
	createButton[0].addEventListener("click", createItem);

	const readButton = document.getElementsByClassName("read");
	readButton[0].addEventListener("click", readItem);

	const updateButton = document.getElementsByClassName("update");
	updateButton[0].addEventListener("click", updateItem);

	const deleteButton = document.getElementsByClassName("delete");
	deleteButton[0].addEventListener("click", deleteItem);
