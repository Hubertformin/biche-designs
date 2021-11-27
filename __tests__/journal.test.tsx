/**
 * @jest-environment jsdom
 */

 import React from 'react'
 import { render, screen } from '@testing-library/react'
 import JournalView from '../pages/journal';
 
 describe('Home', () => {
   it('renders a heading', () => {
     render(<JournalView />)
 
     const heading = screen.getByRole('heading', {
       name: /BICHE'S JOURNAL/i,
     })
 
     expect(heading).toBeInTheDocument()
   })
 })