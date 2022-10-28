// Styles
import '@/styles/app.scss'

// Data
import { GetData } from '@/data/get-data'
const recipeData = GetData()

// Components
import { PreLoader, Recipes, Filters, ScrollTop, Search } from '@/components'

// Initialize components
PreLoader()
Recipes(recipeData)
Filters(recipeData)
ScrollTop()
Search(recipeData)
