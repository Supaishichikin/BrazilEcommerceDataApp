import './navbar.css';

export default function NavBar() {
  return (
    <nav className='olist-nav'>
        <ul className='olist-list'>
            <li className='olist-list-item'>
                <a className='olist-list-item-link' href="/">Top Lists</a>
            </li>
            <li className='olist-list-item'>
                <a className='olist-list-item-link' href="/top">Home</a>
            </li>
            <li className='olist-list-item'>
                <a className='olist-list-item-link' href="/geo">Geo</a>
            </li>
        </ul>
    </nav>
  );
}