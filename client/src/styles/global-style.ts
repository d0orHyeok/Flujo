import { createGlobalStyle } from 'styled-components'
import { reset } from 'styled-reset'

export const GlobalStyle = createGlobalStyle`
    ${reset}
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video, input, textarea {
        box-sizing: border-box
    }
    body {
        font-family: AppFont;
        color: ${({ theme }) => theme.colors.bgText};
        background-color: ${({ theme }) => theme.colors.bgColor};
        line-height: 1.2rem;
        word-break: break-all;

        &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: lightgray;
        }
        &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(${({ theme }) => theme.colors.bgColorRGB}, 0.6);
        }
    }
    h1,h2,h3,h4,h5,h6 {
        font-family: AppFont;
    }
    .logo {
        font-family: AppFontSpecial;
    }
    a, button {
        font-family: inherit;
        text-decoration: inherit;
        color: inherit;
        cursor: pointer;
    }
    button {
        background-color: inherit;
        border: 1px solid ${({ theme }) => theme.colors.border1};
    }
    html, body, #root {
        height: 100%;
    }
`
