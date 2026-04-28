import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <main className="home-main">
        <section className="home-hero">
          <span className="home-hero-badge">Gestao inteligente</span>
          <h1>
            Controle de estoque para
            <span> cafe e restaurante</span>
          </h1>
          <p className="home-hero-sub">
            Organize insumos, acompanhe movimentacoes e tome decisoes com relatorios claros em uma interface moderna.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-hero-primary">
              Entrar no sistema
            </Link>
            <Link to="/register" className="btn-hero-secondary">
              Criar conta
            </Link>
          </div>
        </section>

        <section className="features-section">
          <div className="section-eyebrow">Recursos principais</div>
          <h2>Tudo em um painel objetivo</h2>
          <p>Fluxo simples para operar no dia a dia e reduzir faltas no estoque.</p>

          <div className="features-grid">
            <article className="feature-card">
              <span className="feature-icon">📦</span>
              <h3>Cadastro de produtos</h3>
              <p>Gerencie categorias, unidades e estoque minimo com padrao unico.</p>
            </article>

            <article className="feature-card">
              <span className="feature-icon">🔄</span>
              <h3>Movimentacoes rastreaveis</h3>
              <p>Registre entradas, saidas e ajustes com historico completo.</p>
            </article>

            <article className="feature-card">
              <span className="feature-icon">📈</span>
              <h3>Relatorios e alertas</h3>
              <p>Visualize itens criticos e acompanhe tendencias do seu consumo.</p>
            </article>
          </div>
        </section>

        <section className="cta-section">
          <h2>Comece agora com seu estoque sob controle</h2>
          <p>Entre em segundos e acompanhe o fluxo do seu negocio em tempo real.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-hero-primary">
              Acessar painel
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; Feito com carinho por Isabela Silva - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
