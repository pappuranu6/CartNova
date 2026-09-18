import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (pages <= 1) return null

  const getPageUrl = (pageNumber) => {
    if (isAdmin) {
      return `/admin/productlist/${pageNumber}`
    }

    return keyword
      ? `/search/${keyword}/page/${pageNumber}`
      : `/page/${pageNumber}`
  }

  const pageNumbers = []

  // Previous button
  if (page > 1) {
    pageNumbers.push(
      <LinkContainer key="prev" to={getPageUrl(page - 1)}>
        <Pagination.Prev />
      </LinkContainer>
    )
  }

  // Always show first page
  pageNumbers.push(
    <LinkContainer key={1} to={getPageUrl(1)}>
      <Pagination.Item active={page === 1}>
        1
      </Pagination.Item>
    </LinkContainer>
  )

  // Left dots
  if (page > 4) {
    pageNumbers.push(
      <Pagination.Ellipsis key="left-dots" disabled />
    )
  }

  // Pages around current page
  const start = Math.max(2, page - 1)
  const end = Math.min(pages - 1, page + 1)

  for (let i = start; i <= end; i++) {
    pageNumbers.push(
      <LinkContainer key={i} to={getPageUrl(i)}>
        <Pagination.Item active={i === page}>
          {i}
        </Pagination.Item>
      </LinkContainer>
    )
  }

  // Right dots
  if (page < pages - 3) {
    pageNumbers.push(
      <Pagination.Ellipsis key="right-dots" disabled />
    )
  }

  // Always show last page
  if (pages > 1) {
    pageNumbers.push(
      <LinkContainer key={pages} to={getPageUrl(pages)}>
        <Pagination.Item active={page === pages}>
          {pages}
        </Pagination.Item>
      </LinkContainer>
    )
  }

  // Next button
  if (page < pages) {
    pageNumbers.push(
      <LinkContainer key="next" to={getPageUrl(page + 1)}>
        <Pagination.Next />
      </LinkContainer>
    )
  }

  return <Pagination>{pageNumbers}</Pagination>
}

export default Paginate