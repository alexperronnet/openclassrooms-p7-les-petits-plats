export function Search(recipeData) {
  // Get elements
  const searchInput = document.querySelector('.search__input')
  const searchKbd = document.querySelector('.search__kbd')
  const searchIcon = document.querySelector('.search__icon')
  const noResults = document.querySelector('.no-results')
  const noResultsText = document.querySelector('.no-results__text')
  const noResultsSuggestions = document.querySelector('.no-results__suggestions')

  // Content for search keyboard shortcut
  const searchKbdContent = {
    default: navigator.platform.includes('Mac') ? '⌘ + K' : 'Ctrl + K',
    focusin: 'Echap'
  }

  // Set keyboard shortcut content
  searchKbd.textContent = searchKbdContent.default

  // Update keyboard shortcut content on focus/blur
  searchInput.addEventListener('focusin', () => (searchKbd.textContent = searchKbdContent.focusin))
  searchInput.addEventListener('focusout', () => (searchKbd.textContent = searchKbdContent.default))

  // Focus search input on CTRL + K or CMD + K
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      searchInput.focus()
    }
  })

  // Blur search input on ESC
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (searchInput.value) {
        searchInput.value = ''
        searchInput.dispatchEvent(new Event('input'))
      } else {
        searchInput.blur()
      }
    }
  })

  // Get elements for search results
  const recipes = document.querySelector('.recipes')

  // Start search
  searchInput.addEventListener('input', event => {
    // Get recipe cards
    const recipeCards = document.querySelectorAll('.recipe-card:not([filtered])')

    // Normalize strings
    const Normalize = string =>
      string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .split(/\W+/)

    // Wait for 2 characters
    if (event.target.value.length >= 3) {
      // Get search value
      const searchValue = Normalize(event.target.value)

      // Get recipes matching search value
      const searchResults = recipeData.filter(recipe => {
        // Get name and ingredients
        const recipeName = Normalize(recipe.name)
        const recipeIngredients = Normalize(recipe.ingredients.join(' '))

        // Get keywords
        const keywords = [...new Set([...recipeName, ...recipeIngredients])]

        // Check if keywords match search value
        return searchValue.every(value => keywords.some(keyword => keyword.includes(value)))
      })

      // Get ids of recipes matching search value
      const searchResultsIds = searchResults.map(recipe => recipe.id)

      // Get recipes matching search value
      const searchResultsCards = [...recipeCards].filter(recipeCard =>
        searchResultsIds.includes(Number(recipeCard.dataset.recipeId))
      )

      // Hide/show recipes
      recipeCards.forEach(recipeCard => {
        searchResultsCards.includes(recipeCard) ? (recipeCard.hidden = false) : (recipeCard.hidden = true)
      })
    } else {
      // Show all recipes
      recipeCards.forEach(recipeCard => (recipeCard.hidden = false))
    }

    // Check if there are recipes
    recipes.hidden = [...recipeCards].every(recipeCard => recipeCard.hidden)

    // If no recipes, show message
    if (recipes.hidden) {
      // Set state
      searchInput.setAttribute('error', '')
      noResults.hidden = false

      // Update the icon
      searchIcon.innerHTML = `
        <use xlink:href="assets/sprite.svg#icon-error" />
      `

      // Get first word of search value
      const firstWord = Normalize(event.target.value)[0]

      // Get suggestions
      const suggestions = recipeData
        .filter(recipe => Normalize(recipe.name).includes(firstWord))
        .map(recipe => recipe.name)

      // If there are suggestions, show them
      if (suggestions.length && document.querySelector('.tags[no-tags]')) {
        // Clear suggestions
        noResultsSuggestions.innerHTML = ''

        // Update text
        noResultsText.textContent = 'Aucune recette ne correspond à votre recherche. Voici quelques suggestions :'

        // Show suggestions
        noResultsSuggestions.removeAttribute('no-suggestions')

        // For each suggestion
        suggestions.forEach(suggestion => {
          noResultsSuggestions.innerHTML += `
            <li class="no-results__suggestion">
              <button class="no-results__suggestion-button">${suggestion}</button>
            </li>
          `
        })

        // Add event listener to each suggestion
        noResultsSuggestions.querySelectorAll('.no-results__suggestion-button').forEach(suggestionButton => {
          suggestionButton.addEventListener('click', () => {
            // Update search input
            searchInput.value = suggestionButton.textContent

            // Dispatch input event
            searchInput.dispatchEvent(new Event('input'))

            // Focus search input
            searchInput.focus()
          })
        })
      } else {
        noResultsSuggestions.setAttribute('no-suggestions', '')
        noResultsText.textContent =
          'Aucune recette ne correspond à votre recherche. Essayez de réduire vos critères de recherche.'
      }
    } else {
      // Set state
      searchInput.removeAttribute('error')
      noResults.hidden = true

      // Update the icon
      searchIcon.innerHTML = `
        <use xlink:href="assets/sprite.svg#icon-search" />
      `
    }
  })

  // On blur, dispatch event to update recipe cards
  searchInput.addEventListener('focusout', () => {
    document.dispatchEvent(new Event('searchDone'))
  })
}
