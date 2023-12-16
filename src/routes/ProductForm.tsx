import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { ValidationError } from 'yup';

import * as yup from 'yup';

// Styled components

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
`;


const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
`;

const CheckboxInput = styled.input`
    appearance: none;
    border: 1.5px solid gainsboro;
    border-radius: 0.35rem;
    width: 1.5rem;
    height: 1.5rem;

    &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: limegreen;
    }
`;

const SubmitButton = styled.button`
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;


const ProductForm: React.FC = () => {
    const [formData, setFormData] = useState({
        productTitle: "",
        productPrice: 0,
        productStock: 0,
        image: undefined,
        category: "",
        isDiscountedProduct: false,
        isNewProduct: false,
        isPopularProduct: false,
        productDiscountPrice: 0,
    });

    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});

    const productSchema = yup.object().shape({
        productTitle: yup.string().required('상품명은 필수 입력 값입니다.'),
        productPrice: yup.number().min(1, '가격은 최소 1 이상이어야 합니다.').required('가격은 필수 입력 값입니다.'),
        productStock: yup.number().min(1, '재고는 최소 1 이상이어야 합니다.').required('재고는 필수 입력 값입니다.'),
        // Add other validations as needed
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;

        // Handle checkboxes
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        }
        // Handle file inputs
        else if (type === "file") {
            const files = (e.target as HTMLInputElement).files;
            setFormData((prevData) => ({
                ...prevData,
                [name]: files && files.length > 0 ? files[0] : null,
            }));
        }
        // Handle other input types (text, number, etc.)
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            productTitle: "",
            productPrice: 0,
            productStock: 0,
            image: undefined,
            category: "",
            isDiscountedProduct: false,
            isNewProduct: false,
            isPopularProduct: false,
            productDiscountPrice: 0,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('onsubmit triggered!')
        e.preventDefault();

        const formDataForSubmission = new FormData();

        formDataForSubmission.append("productTitle", formData.productTitle);
        formDataForSubmission.append("productPrice", formData.productPrice.toString());
        formDataForSubmission.append("productStock", formData.productStock.toString());
        formDataForSubmission.append("category", formData.category);
        formDataForSubmission.append("isDiscountedProduct", formData.isDiscountedProduct.toString());
        formDataForSubmission.append("isNewProduct", formData.isNewProduct.toString());
        formDataForSubmission.append("isPopularProduct", formData.isPopularProduct.toString());
        formDataForSubmission.append("productDiscountPrice", formData.productDiscountPrice.toString());

        // Check if image is defined before appending it
        if (formData.image) {
            formDataForSubmission.append("image", formData.image as Blob, "image.jpeg");
        }

        try {

            await productSchema.validate(formData, { abortEarly: false });

            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                // Handle the case where the access token is missing, e.g., redirect to the login page.
                console.error('Access token is missing.');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data', // Or the appropriate content type for your request
            };
            console.log('onsubmit triggered!1')
            const response = await axios.post(
                `${process.env.REACT_APP_DONG10_BASEURL}/products/create`,
                formDataForSubmission,
                { headers }
            );
            console.log('onsubmit triggered!2')

            // Check if the response contains an error message
            if (response.data.error) {
                console.log('onsubmit triggered!3')
                console.error("Error creating product:", response.data.error);
            } else {
                // Handle the successful response, e.g., show a success message to the user
                console.log("Product created successfully:", response.data);

                // Set success message
                setSuccessMessage('Product created successfully!');

                // Reset the form after a delay (you can adjust the delay as needed)
                setTimeout(() => {
                    setSuccessMessage(null);
                    resetForm();
                }, 1000); // 1000 milliseconds (1 seconds) delay
            }

            // Clear validation errors
            setValidationErrors({});

        }
        // catch (error) {
        //     // Handle errors, e.g., display validation errors or a failure message
        //     console.error("Error creating product:", error);
        // }
        catch (validationError) {
            if (validationError instanceof yup.ValidationError) {
                const errors: { [key: string]: string } = {};
                validationError.inner.forEach((err) => {
                    errors[err.path as string] = err.message;
                });
                setValidationErrors(errors);
            }
        }
    };

    return (
        <Container>
            <h2>Product Form</h2>
            {successMessage && (
                <div>
                    <p>{successMessage}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Product Title:</Label>
                    <Input
                        type="text"
                        name="productTitle"
                        value={formData.productTitle}
                        onChange={handleChange}
                    />
                    {validationErrors.productTitle && (
                        <ErrorMessage>{validationErrors.productTitle}</ErrorMessage>
                    )}
                    <Label>Product Price:</Label>
                    <Input
                        type="number"
                        name="productPrice"
                        value={formData.productPrice}
                        onChange={handleChange}
                    />
                    {validationErrors.productPrice && (
                        <ErrorMessage>{validationErrors.productPrice}</ErrorMessage>
                    )}
                    <Label>Product Stock:</Label>
                    <Input
                        type="number"
                        name="productStock"
                        value={formData.productStock}
                        onChange={handleChange}
                    />
                    {validationErrors.productStock && (
                        <ErrorMessage>{validationErrors.productStock}</ErrorMessage>
                    )}
                    <Label>Category:</Label>
                    <Input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup as={CheckboxLabel}>
                    <Label>
                        Is Discounted Product:
                        <CheckboxInput
                            type="checkbox"
                            name="isDiscountedProduct"
                            checked={formData.isDiscountedProduct}
                            onChange={handleChange}
                        />
                    </Label>
                    <Label>
                        Is New Product:
                        <CheckboxInput
                            type="checkbox"
                            name="isNewProduct"
                            checked={formData.isNewProduct}
                            onChange={handleChange}
                        />
                    </Label>

                    <Label>
                        Is Popular Product:
                        <CheckboxInput
                            type="checkbox"
                            name="isPopularProduct"
                            checked={formData.isPopularProduct}
                            onChange={handleChange}
                        />
                    </Label>
                </FormGroup>

                <FormGroup>
                    <Label>Product Discount Price:</Label>
                    <Input
                        type="number"
                        name="productDiscountPrice"
                        value={formData.productDiscountPrice}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Image:</Label>
                    <Input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                </FormGroup>

                <SubmitButton type="submit">Submit</SubmitButton>
            </form>
        </Container>
    );
};

export default ProductForm;