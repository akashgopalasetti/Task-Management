import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: '60px' }}>{children}</main> {/* Leave space for fixed footer */}
      <Footer />
    </>
  );
}
