import { MainLayout } from '../components/layout/MainLayout';
import { FavoriteList } from '../components/favorites/FavoriteList';

export default function FavoritesPage() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <FavoriteList />
      </div>
    </MainLayout>
  );
}