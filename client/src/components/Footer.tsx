

const Footer = () => {
    return (
        <footer className="bg-gray-800 py-4">
        <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} </p>
            <p>
            <a href="https://github.com/Ivy-Taff" className="text-gray-400 hover:text-white">Ivy Taff</a> | 
            <a href="https://github.com/gerdesjasonl" className="text-gray-400 hover:text-white">Jason Gerdes</a> | 
            <a href="https://github.com/Code-king-pm" className="text-gray-400 hover:text-white">Nathan Chavers</a> | 
            <a href="https://github.com/erindagfoley" className="text-gray-400 hover:text-white">Erin Foley</a> | 
            <a href="https://github.com/AdiPatel095" className="text-gray-400 hover:text-white">Adi Patel</a>
            </p>
        </div>
        </footer>
    );
    }

    export default Footer;