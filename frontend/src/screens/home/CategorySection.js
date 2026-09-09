import React from 'react'
import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Electronics',
    icon: '📱',
    link: '/search/electronics',
  },
  {
    name: 'Fashion',
    icon: '👕',
    link: '/search/fashion',
  },
  {
    name: 'Laptops',
    icon: '💻',
    link: '/search/laptop',
  },
  {
    name: 'Home & Living',
    icon: '🏠',
    link: '/search/home',
  },
  {
    name: 'Shoes',
    icon: '👟',
    link: '/search/shoes',
  },
  {
    name: 'Accessories',
    icon: '👜',
    link: '/search/accessories',
  },
  {
    name: 'Beauty',
    icon: '💄',
    link: '/search/beauty',
  },
  {
    name: 'Sports',
    icon: '⚽',
    link: '/search/sports',
  },
  {
    name: 'Toys & Games',
    icon: '🧸',
    link: '/search/toys',
  },
  {
    name: 'Books',
    icon: '📚',
    link: '/search/books',
  },
]

const CategorySection = () => {
  return (
    <section className="cartnova-category-section">

      <div className="cartnova-section-header">
        <div>
          <h2 className="cartnova-section-title">
            Shop by Category
          </h2>

          <p className="cartnova-section-subtitle">
            Explore products from your favourite categories
          </p>
        </div>

        <Link to="/" className="cartnova-view-all">
          View All →
        </Link>
      </div>

      <div className="cartnova-categories">

        {categories.map((category) => (
          <Link
            to={category.link}
            className="cartnova-category"
            key={category.name}
          >
            <div className="cartnova-category-icon">
              {category.icon}
            </div>

            <div className="cartnova-category-name">
              {category.name}
            </div>
          </Link>
        ))}

      </div>

    </section>
  )
}

export default CategorySection