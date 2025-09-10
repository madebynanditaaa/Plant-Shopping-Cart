package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"image_url"`
	Description string  `json:"description"`
}

type CartItem struct {
	ID        int     `json:"id"`
	ProductID int     `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Product   Product `json:"product"`
}

var db *sql.DB

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	var err error

	// Connect to Postgres
	connStr := "postgres://user:password@db:5432/plants?sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Database not reachable:", err)
	}

	log.Println("Connected to database successfully.")

	// Setup router
	r := mux.NewRouter()
	r.Use(enableCORS)

	// API routes
	r.HandleFunc("/products", getProducts).Methods("GET")
	r.HandleFunc("/cart", getCart).Methods("GET")
	r.HandleFunc("/cart", addToCart).Methods("POST")
	r.HandleFunc("/cart/{id}", updateCartItem).Methods("PUT")
	r.HandleFunc("/cart/{id}", deleteCartItem).Methods("DELETE")

	// Serve static files for images from ./images folder
	imagesPath := filepath.Join(".", "images")
	fs := http.FileServer(http.Dir(imagesPath))
	r.PathPrefix("/images/").Handler(http.StripPrefix("/images/", fs))

	log.Println("Backend running on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, price, image_url, description FROM products")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.ImageURL, &p.Description); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	jsonResponse(w, products)
}

func getCart(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT c.id, c.product_id, c.quantity, p.id, p.name, p.price, p.image_url, p.description
		FROM cart c
		JOIN products p ON p.id = c.product_id
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cart []CartItem
	for rows.Next() {
		var c CartItem
		if err := rows.Scan(&c.ID, &c.ProductID, &c.Quantity,
			&c.Product.ID, &c.Product.Name, &c.Product.Price, &c.Product.ImageURL, &c.Product.Description); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		cart = append(cart, c)
	}

	jsonResponse(w, cart)
}

func addToCart(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		ProductID int `json:"product_id"`
		Quantity  int `json:"quantity"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Quantity <= 0 {
		payload.Quantity = 1
	}

	var existingID, existingQty int
	err := db.QueryRow("SELECT id, quantity FROM cart WHERE product_id = $1", payload.ProductID).
		Scan(&existingID, &existingQty)

	if err == sql.ErrNoRows {
		_, err := db.Exec("INSERT INTO cart (product_id, quantity) VALUES ($1, $2)", payload.ProductID, payload.Quantity)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else if err == nil {
		_, err := db.Exec("UPDATE cart SET quantity = $1 WHERE id = $2", existingQty+payload.Quantity, existingID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func updateCartItem(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var payload struct {
		Quantity int `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Quantity <= 0 {
		http.Error(w, "Quantity must be > 0", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("UPDATE cart SET quantity = $1 WHERE id = $2", payload.Quantity, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func deleteCartItem(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	_, err := db.Exec("DELETE FROM cart WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func jsonResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
