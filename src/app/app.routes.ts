import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth-module').then(m => m.AuthModule)
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./features/admin/admin-module').then(m => m.AdminModule),
        canActivate: [adminGuard]
    },
    {
        path: 'enseignant',
        loadChildren: () => import('./features/enseignant/enseignant-module').then(m => m.EnseignantModule),
        canActivate: [authGuard]
    },
    {
        path: 'etudiant',
        loadChildren: () => import('./features/etudiant/etudiant-module').then(m => m.EtudiantModule),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'auth/login' }
];