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
    name: 'Shoes',
    icon: '👟',
    link: '/search/shoes',
  },
  {
    name: 'Home & Living',
    icon: '🏠',
    link: '/search/home',
  },
  {
    name: 'Books',
    icon: '📚',
    link: '/search/books',
  },
]

const CategorySection = () => {
  return (
    <section className='cartnova-category-section'>

      <div className='cartnova-categories'>

        {categories.map((category) => (
          <Link
            to={category.link}
            className='cartnova-category'
            key={category.name}
          >

            <div className='cartnova-category-icon'>
              {category.icon}
            </div>

            <div className='cartnova-category-name'>
              {category.name}
            </div>

            <span className='cartnova-category-arrow'>
              →
            </span>

          </Link>
        ))}

      </div>

    </section>
  )
}

export default CategorySection