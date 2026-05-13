import { useNavigate } from 'react-router-dom';
import { MapPinHouse,NotebookTabs,User,Users,UserStar,LogOut,Trash } from 'lucide-react';
import { useModuleAuth } from '../../../../auth/hooks/useModuleAuth';

import './LojaPerfil.css';

export default function LojaPerfil() {
  const { user, logout } = useModuleAuth("loja");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1><User /> Perfil</h1>
        <p className="page-subtitle">Gerencie seus dados pessoais</p>
      </div>

      <div className="perfil-container">
        <div className="perfil-card">
          <h2>Informações Pessoais</h2>

          <div className="info-row">
            <span className="info-label">Nome:</span>
            <span className="info-value">{user?.nome}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Tipo de Conta:</span>
            <span className="info-value">
            {user?.tipo === 'admin' ? (
                <>
                  <UserStar size={16} style={{ marginRight: '6px' }} />
                  Administrador
                </> 
              ) : (
                <>
                  <Users size={16} style={{ marginRight: '6px' }} />
                  Cliente
                </>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Data de Cadastro:</span>
            <span className="info-value">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="perfil-card">
          <h2>Endereço de Entrega</h2>

          <button className="btn-action"> <MapPinHouse size={16} /> Adicionar/Editar Endereço</button>
          <button className="btn-action"><NotebookTabs size={16} /> Meus Endereços</button>
        </div>

        {user?.tipo === 'admin' && (
          <div className="perfil-card admin">
            <h2>⚙️ Painel Administrativo</h2>
            <p>Você tem acesso às ferramentas administrativas da loja.</p>
            <button className="btn-action"><NotebookTabs size={16} /> Dashboard Admin</button>
          </div>
        )}

        <div className="perfil-card danger">
          <h2>Zona de Perigo</h2>

          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Sair da Conta
          </button>

          <button className="btn-delete"><Trash size={16} /> Deletar Conta</button>

          <p className="warning-text">
            Atenção: Deletar sua conta é permanente. Todos os dados serão removidos.
          </p>
        </div>
      </div>
    </div>
  );
}
