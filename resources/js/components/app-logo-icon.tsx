import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src="/logo_light.svg"
            alt="Logo Gestion Bénéficiaire"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '8px' // Ajout des bordures arrondies

            }}
            {...props}
        />
    );
}
