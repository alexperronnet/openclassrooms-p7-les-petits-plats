// Styles
import '@/styles/app.scss'

// Data
import { GetData } from '@/data/get-data'
const recipeData = GetData()

// Components
import { Recipes, ScrollTop, Search } from '@/components'

// Initialize components
Recipes(recipeData)
ScrollTop()
Search(recipeData)
