export function Tags(event, category, filterList, recipeData) {
  // Get value
  const filterItemValue = event.target.parentElement.dataset.value

  // Create template
  const template = document.createElement('template')

  // Set template
  template.innerHTML = `
    <li class="tags__item" data-value="${filterItemValue}" data-category="${category}">
      <button class="tags__item-button">
        <span class="tags__item-button-text">${filterItemValue}</span>
        <svg class="tags__item-button-icon">
          <use xlink:href="assets/sprite.svg#icon-close" />
        </svg>
      </button>
    </li>
  `

  // Append
  document.querySelector('.tags__list').append(template.content.cloneNode(true))

  // Get all recipes cards
  const recipesCards = document.querySelectorAll('.recipe-card')

  // Loop through recipes cards
  recipesCards.forEach(recipeCard => {
    // Get ID
    const recipeId = recipeCard.dataset.recipeId
    const recipeIndex = recipeId - 1

    // Get filters
    const recipeFilters = recipeData[recipeIndex].filters

    // Hide/Show recipe card
    if (recipeFilters.includes(filterItemValue) && !recipeCard.hidden) {
      recipeCard.hidden = false
      recipeCard.removeAttribute('filtered')
    } else {
      recipeCard.hidden = true
      recipeCard.setAttribute('filtered', '')
    }
  })

  // If no-tags, remove no-tags
  document.querySelector('.tags').hasAttribute('no-tags') && document.querySelector('.tags').removeAttribute('no-tags')

  // Set state
  event.target.parentElement.setAttribute('selected', '')
  event.target.disabled = true

  // On click, remove tag
  document.querySelector('.tags__list').lastElementChild.addEventListener('click', event => {
    // Get value
    const tagValue = event.target.closest('.tags__item').dataset.value

    // Remove tag
    event.target.closest('.tags__item').remove()

    // Set state
    filterList.querySelector(`[data-value="${tagValue}"]`).removeAttribute('selected')
    filterList.querySelector(`[data-value="${tagValue}"] button`).disabled = false

    // Get all recipes cards
    const recipesCards = document.querySelectorAll('.recipe-card')

    // Get all tags
    const tags = document.querySelectorAll('.tags__item')

    // Get all tags values
    const tagsValues = []

    tags.forEach(tag => {
      tagsValues.push(tag.dataset.value)
    })

    // Remove hidden attribute and filtered attribute from all recipes cards that match tags
    recipesCards.forEach(recipeCard => {
      // Get ID
      const recipeId = recipeCard.dataset.recipeId
      const recipeIndex = recipeId - 1

      // Get filters
      const recipeFilters = recipeData[recipeIndex].filters

      // Show recipe card
      if (tagsValues.every(tagValue => recipeFilters.includes(tagValue))) {
        recipeCard.hidden = false
        recipeCard.removeAttribute('filtered')
      }
    })

    // If no tags, add no-tags
    if (tags.length === 0) {
      document.querySelector('.tags').setAttribute('no-tags', '')
      // Dispatch searchDone event
      document.dispatchEvent(new Event('searchDone'))
    }
  })

  // On click on reset button, remove all tags
  document.querySelector('.tags__reset').addEventListener('click', event => {
    // Remove tags
    document.querySelectorAll('.tags__item').forEach(tag => tag.remove())
    // Set state
    filterList.querySelectorAll('.filter__item').forEach(filterItem => {
      filterItem.removeAttribute('selected')
      filterItem.querySelector('button').disabled = false
    })

    // If no tags, add no-tags
    document.querySelector('.tags__list').children.length === 0 &&
      document.querySelector('.tags').setAttribute('no-tags', '')

    // Get all recipes cards
    const recipesCards = document.querySelectorAll('.recipe-card')

    // Loop through recipes cards
    recipesCards.forEach(recipeCard => {
      // Show recipe card
      recipeCard.hidden = false
      recipeCard.removeAttribute('filtered')
    })

    // Dispatch searchDone event
    document.dispatchEvent(new Event('searchDone'))

    // Validate the current value of the input
    const searchInput = document.querySelector('.search__input')
    const searchInputValue = searchInput.value
    searchInput.dispatchEvent(new Event('input'))
  })

  // Dispatch searchDone event
  document.dispatchEvent(new Event('searchDone'))
}
