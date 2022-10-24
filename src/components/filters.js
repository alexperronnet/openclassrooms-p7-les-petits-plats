export function Filters(recipeData) {
  // Get elements
  const filters = document.querySelector('.filters')

  // Create filters for each category
  Object.keys(recipeData.filters).forEach(category => {
    // Translate category
    const categoryTranslation = {
      ingredients: 'ingrédients',
      appliances: 'appareils',
      ustensils: 'ustensiles'
    }

    // Get template
    const template = document.querySelector('#filter-category-template')

    // Clone template
    const clone = template.content.cloneNode(true)

    // Get elements
    const filter = clone.querySelector('.filter')
    const filterButton = clone.querySelector('.filter__button')
    const filterButtonText = clone.querySelector('.filter__button-text')
    const filterDropdown = clone.querySelector('.filter__dropdown')
    const filterLabel = clone.querySelector('.filter__label')
    const filterInput = clone.querySelector('.filter__input')
    const filterList = clone.querySelector('.filter__list')

    // Set attributes
    filter.dataset.filterCategory = category
    filterButton.dataset.filterCategory = category
    filterDropdown.dataset.filterCategory = category
    filterLabel.htmlFor = `filter-input-${category}`
    filterInput.id = `filter-input-${category}`

    // Set values
    filterButtonText.textContent = categoryTranslation[category]

    // Create filters for each item
    recipeData.filters[category].forEach(item => {
      // Create template
      const template = document.createElement('template')

      // Set template
      template.innerHTML = `
        <li class="filter__item" data-value="${item}">
          <button class="filter__item-button">${item}</button>
        </li>
      `

      // Append
      filterList.append(template.content.cloneNode(true))
    })

    // Append clone to filters
    filters.append(clone)

    // Open/close dropdown
    filterButton.addEventListener('click', event => {
      // Set state
      filter.ariaHasPopup = filter.ariaHasPopup === 'false' ? 'true' : 'false'
      filterButton.ariaExpanded = filterButton.ariaExpanded === 'false' ? 'true' : 'false'
      filterDropdown.hidden = !filterDropdown.hidden

      // Close other dropdowns
      document.querySelectorAll('.filter').forEach(filter => {
        if (filter !== filterButton.parentElement) {
          filter.ariaHasPopup = 'false'
          filter.querySelector('.filter__button').ariaExpanded = 'false'
          filter.querySelector('.filter__dropdown').hidden = true
        }
      })

      // Focus input
      filterInput.focus()
    })

    // Close dropdowns
    const CloseDropdowns = () => {
      // Set state
      filter.ariaHasPopup = 'false'
      filterButton.ariaExpanded = 'false'
      filterDropdown.hidden = true
    }

    // Close dropdowns on click outside
    document.addEventListener('click', event => !event.target.closest('.filter') && CloseDropdowns())

    // Close dropdowns on escape
    filterDropdown.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        // If input is not empty, clear it
        if (filterInput.value) {
          filterInput.value = ''
          filterInput.dispatchEvent(new Event('input'))
        } else {
          CloseDropdowns()
        }
      }
    })

    // Search filter
    filterInput.addEventListener('input', event => {
      const Normalize = string =>
        string
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .split(/\W+/)

      // Get filter value
      const filterValue = Normalize(event.target.value)

      // Loop through filter items
      filterList.querySelectorAll('.filter__item').forEach(filterItem => {
        // Get dataset value
        const filterItemValue = Normalize(filterItem.dataset.value)

        // Check if dataset value matches filter value
        filterValue.every(value => filterItemValue.some(keyword => keyword.includes(value)))
          ? (filterItem.hidden = false)
          : (filterItem.hidden = true)
      })
    })
  })

  // On blur of search input hide filters
  document.addEventListener('searchDone', () => {
    // Get not hidden recipes
    const DisplayedRecipes = document.querySelectorAll('.recipe-card:not([hidden])')

    // Get IDs of not hidden recipes
    const recipesIds = Array.from(DisplayedRecipes).map(recipe => recipe.dataset.recipeId)

    // Get filters of not hidden recipes
    const recipesFilters = [
      ...new Set(recipesIds.map(id => recipeData.find(recipe => recipe.id === Number(id)).filters).flat())
    ]

    // Loop through filters items
    document.querySelectorAll('.filter__item').forEach(item => {
      // Get value
      const value = item.dataset.value

      // Check if values matches filters
      recipesFilters.includes(value) ? (item.hidden = false) : (item.hidden = true)
    })
  })
}
