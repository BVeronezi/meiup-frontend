import { render, screen } from '@testing-library/react';
import { renderWithTheme } from '../../utils/tests/helpers';
import MButton from '.';

describe('Button component', () => {

    it('renders correctly', () => {
        render(
                <MButton handleClick={() => {}}>Entrar </MButton>
            )
    
         expect(screen.getByText('Entrar')).toBeInTheDocument();
    })
})