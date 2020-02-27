import React, { useState, lazy, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { API_URL } from '../../support/API_URL'
import { Select, MenuItem, DialogActions, Button, DialogContent } from '@material-ui/core'

import Loading from '../Loading'
import { getBrandByCategoryId, addProduct, getProductByCategoryId, selectCat } from '../../redux/actions'

const FormProductData = lazy(() => import('./FormProductData'))
const ModalWarning = lazy(() => import('../ModalWarning'))

function FormAddProduct({ limit, offset, mostParent, show, setShow }) {

    const dispatch = useDispatch()
    const brandByCategory = useSelector(({ brands }) => brands.brandByCategory)

    const initialState = {
        catList: [mostParent],
        newCategories: [0],
        newProduct: { brandId: 0, name: '', description: '', weight: '', wattage: '', price: '', stock: '' }
    }
    const [state, setState] = useState(initialState)
    const [showModal, setShowModal] = useState(false)

    let { catList, newCategories, newProduct } = state

    const onSelectCat = async (e, index) => {
        try {
            let val = parseInt(e.target.value)
            if (index === 0) { await dispatch(getBrandByCategoryId(val)) }

            const catChild = await axios.get(`${API_URL}/categories/child/${val}`)
            if (catChild.data.length !== 0 || catList.length === 1) {
                catList.splice(index + 1, catList.length - index - 1, catChild.data)
            }
            newCategories.splice(index, newCategories.length - index - 1, val)
            setState({
                ...state, catList, newCategories,
                newProduct: { ...state.newProduct, brandId: 0 }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const onSelectBrand = e => setState({
        ...state, newProduct: {
            ...newProduct, brandId: parseInt(e.target.value)
        }
    })


    const onInputChange = e => {
        let val = e.target.type === 'number' && e.target.value !== '' ? parseInt(e.target.value) : e.target.value
        setState({
            ...state, newProduct: {
                ...newProduct,
                [e.target.id]: val
            }
        })
    }

    const onInputDescChange = data => {
        setState({
            ...state, newProduct: {
                ...newProduct, description: data
            }
        })
    }

    const onSaveProductClick = async () => {

        for (const key in state.newProduct) {
            if (state.newProduct[key] === initialState.newProduct[key]
                || state.newCategories[0] === initialState.newCategories[0]) {
                return setShowModal(!showModal)
            }
        }
        let data = {
            newProduct,
            newCategories: newCategories.slice(0, newCategories.length - 1)
        }
        console.log(data)
        await dispatch(addProduct(data))
        await dispatch(getProductByCategoryId(data.newCategories[0], limit, offset))
        await dispatch(selectCat(data.newCategories[0]))
        setState(initialState)
        setShow(!show)
    }

    const renderSelectCategory = () => (
        catList.map((category, index) => (
            <Select
                key={index}
                value={newCategories[index] ? newCategories[index] : 0}
                onChange={e => onSelectCat(e, index)}
            >
                <MenuItem value={0}>Choose Category:</MenuItem>
                {category.map(i => (
                    <MenuItem key={i.id} value={i.id}>{i.category}</MenuItem>
                ))}
            </Select>
        ))
    )
    return (
        <div>
            <DialogContent>
                {renderSelectCategory()}
                {newCategories[0] !== 0 ? (
                    <div>
                        <br />
                        <Suspense fallback={<Loading />}>
                            <FormProductData
                                product={newProduct}
                                brand={brandByCategory}
                                onSelectBrand={onSelectBrand}
                                onInputChange={onInputChange}
                                onInputDescChange={onInputDescChange}
                            />
                        </Suspense>
                    </div>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={() => setShow(!show)} >CANCEL</Button>
                <Button color="secondary" onClick={onSaveProductClick} >SAVE</Button>
            </DialogActions>
            {showModal ? (
                <Suspense fallback={<Loading />}>
                    <ModalWarning
                        title='Warning'
                        show={showModal}
                        setShow={setShowModal}
                    >Please select category and fill the form correctly!</ModalWarning>
                </Suspense>
            ) : null}
        </div>
    )
}

export default FormAddProduct

