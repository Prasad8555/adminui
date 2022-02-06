import {
  AiOutlineDoubleLeft,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineDoubleRight,
} from 'react-icons/ai'
import {
  NavigationButtons,
  StartingNavigationButton,
  PreviousNavigationButton,
  ForwardNavigationButton,
  EndNavigationButton,
} from './styledComponents'

import './index.css'

const Pagination = props => {
  const {users, pagesCount, navigateTo} = props
  const usersPerPage = 10
  const totalUsers = users.length
  const totalPages = []
  for (let i = 1; i <= Math.round(totalUsers / usersPerPage); i += 1) {
    totalPages.push(i)
  }
  const pagesLimit = totalPages.slice(-1)

  const onClickPage = event => {
    navigateTo(event.target.value)
  }

  const onClickEnd = () => {
    if (pagesLimit - 1 !== pagesCount) {
      navigateTo(pagesLimit)
    }
  }

  const onClickForward = () => {
    if (pagesLimit > pagesCount + 1) {
      navigateTo(pagesCount + 2)
    }
  }

  const onClickPrevious = () => {
    if (pagesCount > 0) {
      navigateTo(pagesCount)
    }
  }

  const onClickStart = () => {
    if (pagesCount !== 0) {
      navigateTo(1)
    }
  }

  const onClickDeleteSelected = () => {
    const {deleteSelected} = props
    deleteSelected()
  }

  return (
    <div className="pagination-container">
      <button
        className="delete-selected-button"
        type="button"
        onClick={onClickDeleteSelected}
      >
        Delete Selected
      </button>
      <ul className="pagination-controls">
        <li key="doubleLeft">
          <StartingNavigationButton
            isDisabled={pagesCount !== 0}
            type="button"
            onClick={onClickStart}
            className="start-navigation-button"
          >
            <AiOutlineDoubleLeft />
          </StartingNavigationButton>
        </li>
        <li key="left">
          <PreviousNavigationButton
            isDisabled={pagesCount !== 0}
            type="button"
            onClick={onClickPrevious}
            className="previous-navigation-button"
          >
            <AiOutlineLeft />
          </PreviousNavigationButton>
        </li>
        {totalPages.map(eachPage => (
          <li key={eachPage}>
            <NavigationButtons
              isActive={pagesCount === eachPage - 1}
              className="navigation-button"
              value={eachPage}
              type="button"
              onClick={onClickPage}
            >
              {eachPage}
            </NavigationButtons>
          </li>
        ))}
        <li key="right">
          <ForwardNavigationButton
            isDisabled={pagesCount !== pagesLimit - 1}
            type="button"
            onClick={onClickForward}
            className="forward-navigation-button"
          >
            <AiOutlineRight />
          </ForwardNavigationButton>
        </li>
        <li key="doubleRight">
          <EndNavigationButton
            isDisabled={pagesCount !== pagesLimit - 1}
            type="button"
            onClick={onClickEnd}
            className="end-navigation-button"
          >
            <AiOutlineDoubleRight />
          </EndNavigationButton>
        </li>
      </ul>
    </div>
  )
}

export default Pagination
