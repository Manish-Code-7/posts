import React, { useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PostContext } from '../store/Postcontext';

const Breadcrumb = () => {
    const location = useLocation();
    const params = useParams();
    const { posts, users } = useContext(PostContext);

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const crumbs = [{ label: 'Home', path: '/' }];

        // User posts page
        if (path.startsWith('/user/')) {
            const userId = parseInt(params.userId);
            const user = users.find(u => u.id === userId);
            crumbs.push({
                label: user ? `${user.name}'s Posts` : 'User Posts',
                path: `/user/${userId}`
            });
        }

        // Post details page
        if (path.startsWith('/post/')) {
            const postId = parseInt(params.id);
            const post = posts.find(p => p.id === postId);

            // If we came from a user page, add that breadcrumb
            if (post) {
                const user = users.find(u => u.id === post.userId);
                if (user) {
                    crumbs.push({
                        label: `${user.name}'s Posts`,
                        path: `/user/${user.id}`
                    });
                }
            }

            crumbs.push({
                label: post ? post.title.substring(0, 30) + '...' : 'Post Details',
                path: path,
                active: true
            });
        }

        return crumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    // Don't show breadcrumbs on home page
    if (location.pathname === '/') {
        return null;
    }

    return (
        <nav style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e0e0e0',
            fontSize: '0.9rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        {index > 0 && (
                            <span style={{ color: '#999' }}>›</span>
                        )}
                        {crumb.active ? (
                            <span style={{ color: '#666', fontWeight: '500' }}>
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                to={crumb.path}
                                style={{
                                    color: '#3498db',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
};

export default Breadcrumb;
