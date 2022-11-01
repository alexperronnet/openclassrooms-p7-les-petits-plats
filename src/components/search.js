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
      SearchAlgoA()
    } else {
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

    // Search algorithm A - forEach
    function SearchAlgoA() {
      // Start monitoring time
      console.clear()
      console.time('search')

      // Get search value
      const searchTerms = Normalize(event.target.value)

      recipeData.forEach((recipe, index) => {
        // Get recipe title and ingredients
        const recipeTitle = Normalize(recipe.name)
        const recipeIngredients = Normalize(recipe.ingredients.join(' '))

        // Get keywords
        const keywords = [...new Set([...recipeTitle, ...recipeIngredients])]

        // Check if search terms are in keywords
        const isMatch = searchTerms.every(term => keywords.some(keyword => keyword.includes(term)))

        // Hide or show recipe card
        recipeCards[index].hidden = !isMatch
      })

      // Stop monitoring time
      console.timeEnd('search')
    }

    // Search algorithm B - map
    function SearchAlgoB() {
      // Start monitoring time
      console.clear()
      console.time('search')

      // Get search value
      const searchTerms = Normalize(event.target.value)

      // Get keywords
      const keywords = recipeData.map(recipe => {
        // Get recipe title and ingredients
        const recipeTitle = Normalize(recipe.name)
        const recipeIngredients = Normalize(recipe.ingredients.join(' '))

        // Get keywords
        return [...new Set([...recipeTitle, ...recipeIngredients])]
      })

      // Check if search terms are in keywords
      const isMatch = keywords.map(keyword =>
        searchTerms.every(term => keyword.some(keyword => keyword.includes(term)))
      )

      // Hide or show recipe cards
      isMatch.forEach((match, index) => (recipeCards[index].hidden = !match))

      // Stop monitoring time
      console.timeEnd('search')
    }

    // Search algorithm C - reduce
    function SearchAlgoC() {
      // Start monitoring time
      console.clear()
      console.time('search')

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
      isMatch.forEach((match, index) => (recipeCards[index].hidden = !match))

      // Stop monitoring time
      console.timeEnd('search')
    }

    // Search algorithm D - filter
    function SearchAlgoD() {
      // Start monitoring time
      console.clear()
      console.time('search')

      // Get search value
      const searchTerms = Normalize(event.target.value)

      // Get keywords
      const keywords = recipeData
        .map(recipe => {
          // Get recipe title and ingredients
          const recipeTitle = Normalize(recipe.name)
          const recipeIngredients = Normalize(recipe.ingredients.join(' '))

          // Get keywords
          return [...new Set([...recipeTitle, ...recipeIngredients])]
        })
        .filter(keyword => searchTerms.every(term => keyword.some(keyword => keyword.includes(term))))

      // Hide or show recipe cards
      recipeCards.forEach((recipeCard, index) => (recipeCard.hidden = !keywords[index]))

      // Stop monitoring time
      console.timeEnd('search')
    }

    // Search algorithm E - for loop
    function SearchAlgoE() {
      // Start monitoring time
      console.clear()
      console.time('search')

      // Get search value
      const searchTerms = Normalize(event.target.value)

      // Get keywords
      const keywords = []
      for (let i = 0; i < recipeData.length; i++) {
        // Get recipe title and ingredients
        const recipeTitle = Normalize(recipeData[i].name)
        const recipeIngredients = Normalize(recipeData[i].ingredients.join(' '))

        // Get keywords
        keywords.push([...new Set([...recipeTitle, ...recipeIngredients])])
      }

      // Check if search terms are in keywords
      const isMatch = []
      for (let i = 0; i < keywords.length; i++) {
        isMatch.push(searchTerms.every(term => keywords[i].some(keyword => keyword.includes(term))))
      }

      // Hide or show recipe cards
      for (let i = 0; i < isMatch.length; i++) {
        recipeCards[i].hidden = !isMatch[i]
      }

      // Stop monitoring time
      console.timeEnd('search')
    }

    // Search algorithm F - while loop
    function SearchAlgoF() {
      // Start monitoring time
      console.clear()
      console.time('search')

      // Get search value
      const searchTerms = Normalize(event.target.value)

      // Get keywords
      const keywords = []
      let i = 0
      while (i < recipeData.length) {
        // Get recipe title and ingredients
        const recipeTitle = Normalize(recipeData[i].name)
        const recipeIngredients = Normalize(recipeData[i].ingredients.join(' '))

        // Get keywords
        keywords.push([...new Set([...recipeTitle, ...recipeIngredients])])

        i++
      }

      // Check if search terms are in keywords
      const isMatch = []
      i = 0
      while (i < keywords.length) {
        isMatch.push(searchTerms.every(term => keywords[i].some(keyword => keyword.includes(term))))

        i++
      }

      // Hide or show recipe cards
      i = 0
      while (i < isMatch.length) {
        recipeCards[i].hidden = !isMatch[i]

        i++
      }

      // Stop monitoring time
      console.timeEnd('search')
    }
  })

  // On blur, dispatch event to update recipe cards
  searchInput.addEventListener('focusout', () => {
    document.dispatchEvent(new Event('searchDone'))
  })
}