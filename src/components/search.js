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

    // Search algorithm (C)
    if (event.target.value.length >= 3) {
      // Get search value
      const searchTerms = Normalize(event.target.value)

      // Get keywords
      const keywords = recipeData.reduce((acc, recipe) => {
        // Get recipe title and ingredients
        const recipeTitle = Normalize(recipe.name)
        const recipeIngredients = Normalize(recipe.ingredients.join(' '))

        // Get keywords
        acc.push([...new Set([...recipeTitle, ...recipeIngredients])])

        return acc
      }, [])

      // Check if search terms are in keywords
      const isMatch = keywords.reduce((acc, keyword) => {
        acc.push(searchTerms.every(term => keyword.some(keyword => keyword.includes(term))))

        return acc
      }, [])

      // Hide or show recipe cards
      recipeCards.forEach(recipeCard => {
        // Get recipe ID
        const recipeId = recipeCard.dataset.recipeId

        // Hide or show recipe card
        recipeCard.hidden = !isMatch[recipeId - 1]
      })
    } else {
      recipeCards.forEach(recipeCard => (recipeCard.hidden = false))
    }

    // Check if there are recipes
    recipes.hidden = [...recipeCards].every(recipeCard => recipeCard.hidden)

    // If no recipes, show message
    if (recipes.hidden && noResults.hidden) {
      // Clear suggestions if any
      noResultsSuggestions.innerHTML = ''

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
        // For each suggestion
        suggestions.forEach(suggestion => {
          noResultsSuggestions.innerHTML += `
            <li class="no-results__suggestion">
              <button class="no-results__suggestion-button">${suggestion}</button>
            </li>
          `
        })
      } else {
        // Get random suggestions
        const randomSuggestions = recipeData
          .map(recipe => recipe.name)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)

        randomSuggestions.forEach(random => {
          // Add suggestions
          noResultsSuggestions.innerHTML += `
            <li class="no-results__suggestion">
              <button class="no-results__suggestion-button">${random}</button>
            </li>
          `
        })
      }

      // Add event listener to each suggestion
      noResultsSuggestions.querySelectorAll('.no-results__suggestion-button').forEach(suggestionButton => {
        suggestionButton.addEventListener('click', () => {
          searchInput.value = suggestionButton.textContent
          searchInput.dispatchEvent(new Event('input'))
          searchInput.focus()

          // Click on reset button if any
          document.querySelector('.tags__reset') && document.querySelector('.tags__reset').click()
        })
      })
    }

    // If there are recipes, hide message
    if (!recipes.hidden && !noResults.hidden) {
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
