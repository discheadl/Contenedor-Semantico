import { useMemo, useState } from 'react'
import './App.css'

type Product = {
  id: number
  name: string
  description: string
  price?: number
  categories: string[]
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Bonafont 1 Lt',
    description: 'Botella de agua natural embotellada.',
    price: 12,
    categories: ['agua', 'bebida', 'natural'],
  },
  {
    id: 2,
    name: 'Epura 20 Lt',
    description: 'Garrafon de agua',
    price: 120,
    categories: ['agua', 'bebida', 'natural'],
  },
  {
    id: 3,
    name: 'Sabritas Clásicas',
    description: 'Papas fritas clásicas tamaño individual.',
    price: 18,
    categories: ['frituras', 'snack', 'salado'],
  },
]

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function App() {
  const [products, setProducts] = useState<Product[]>(() => initialProducts)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoriesText, setCategoriesText] = useState('')
  const [search, setSearch] = useState('')

  const allCategories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .flatMap((p) => p.categories)
            .map((category) => category.trim())
            .filter(Boolean),
        ),
      ).sort(),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const query = normalize(search.trim())

    if (!query) return products

    return products.filter((product) => {
      const byName = normalize(product.name).includes(query)
      const byDescription = normalize(product.description).includes(query)
      const byCategory = product.categories.some((category) =>
        normalize(category).includes(query),
      )

      return byName || byDescription || byCategory
    })
  }, [products, search])

  function handleAddProduct(event: React.FormEvent) {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    const categories = Array.from(
      new Set(
        categoriesText
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
      ),
    )

    const numericPrice = price ? Number(price) : undefined

    const newProduct: Product = {
      id: Date.now(),
      name: trimmedName,
      description: description.trim(),
      price: Number.isFinite(numericPrice!) ? numericPrice : undefined,
      categories,
    }

    setProducts((current) => [newProduct, ...current])
    setName('')
    setDescription('')
    setPrice('')
    setCategoriesText('')
  }

  function handleCategoryClick(category: string) {
    setSearch(category)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Catálogo semántico de tienda</h1>
        <p>
          Crea productos, asígnales categorías y prueba búsquedas que encuentren
          resultados aunque el nombre no coincida literalmente.
        </p>
      </header>

      <main className="app-layout">
        <section className="panel">
          <h2>Búsqueda semántica</h2>
          <p className="panel-helper">
            Busca por nombre, descripción o categoría. Por ejemplo, escribe
            <strong> agua </strong> para ver todos los productos con esa
            categoría, aunque el nombre no sea literalmente "agua".
          </p>

          <label className="field">
            <span>Término de búsqueda</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ej. agua, snack, frituras, dulce..."
            />
          </label>

          {allCategories.length > 0 && (
            <div className="category-suggestions">
              <span>Categorías populares:</span>
              <div className="chips">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="chip chip-button"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="results-header">
            <h3>Resultados</h3>
            <span className="results-count">
              {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="empty-state">
              No hay productos que coincidan con tu búsqueda. Prueba con otra
              palabra clave o agrega un nuevo producto.
            </p>
          ) : (
            <ul className="product-list">
              {filteredProducts.map((product) => (
                <li key={product.id} className="product-card">
                  <div className="product-main">
                    <h4>{product.name}</h4>
                    {product.description && (
                      <p className="product-description">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="product-meta">
                    {typeof product.price === 'number' && (
                      <span className="price">
                        ${product.price.toFixed(2)} MXN
                      </span>
                    )}
                    {product.categories.length > 0 && (
                      <div className="chips">
                        {product.categories.map((category) => (
                          <span key={category} className="chip">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
