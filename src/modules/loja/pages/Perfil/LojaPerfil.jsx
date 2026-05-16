import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";
import { AuthContext } from "../../../../auth/context/AuthContext";
import { lojaAPI } from "../../services/lojaAPI";
import { getAddressByCep } from "../../services/viaCepAPI";

import {
  MapPinHouse,
  NotebookTabs,
  User,
  Users,
  UserStar,
  LogOut,
  Trash,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  MapPin,
  Loader2,
} from "lucide-react";

import "./LojaPerfil.css";

// ── Modal de Listar Endereços ──────────────────────────────────────────────
function ModalListarEnderecos({ clienteId, onClose, onAdicionar }) {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // id do endereço a deletar
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = async () => {
    try {
      setLoading(true);
      const data = await lojaAPI.getEnderecos(clienteId);
      setEnderecos(data);
    } catch (err) {
      console.error("Erro ao carregar endereços:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async () => {
    try {
      setDeletando(true);
      await lojaAPI.removerEndereco(clienteId, confirmDelete);
      const atualizados = enderecos.filter((e) => e.id !== confirmDelete);
      setEnderecos(atualizados);
      setConfirmDelete(null);
      if (atualizados.length === 0) onClose();
    } catch (err) {
      console.error("Erro ao deletar endereço:", err);
    } finally {
      setDeletando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <MapPin size={18} /> Meus Endereços
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <Loader2 size={24} className="spin" />
              <span>Carregando endereços...</span>
            </div>
          ) : enderecos.length === 0 ? (
            <p className="modal-empty">Nenhum endereço cadastrado.</p>
          ) : (
            <ul className="endereco-list">
              {enderecos.map((end) => (
                <li key={end.id} className="endereco-item">
                  <div className="endereco-info">
                    <span className="endereco-tipo">{end.tipoEndereco}</span>
                    <span className="endereco-linha">
                      {end.logradouro}, {end.numero}
                      {end.complemento ? ` - ${end.complemento}` : ""}
                    </span>
                    <span className="endereco-linha">
                      {end.bairro} — {end.cidade}/{end.uf}
                    </span>
                    <span className="endereco-cep">CEP: {end.cep}</span>
                  </div>
                  <button
                    className="btn-icon-delete"
                    onClick={() => setConfirmDelete(end.id)}
                    title="Remover endereço"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Confirmação de delete */}
          {confirmDelete && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                <AlertTriangle size={28} color="#e74c3c" />
                <p>Deseja remover este endereço? Esta ação não pode ser desfeita.</p>
                <div className="confirm-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setConfirmDelete(null)}
                    disabled={deletando}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-confirm-delete"
                    onClick={handleDeletar}
                    disabled={deletando}
                  >
                    {deletando ? (
                      <Loader2 size={14} className="spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-action" onClick={onAdicionar}>
            <Plus size={16} /> Adicionar novo endereço
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Adicionar Endereço ────────────────────────────────────────────
function ModalAdicionarEndereco({ clienteId, onClose, onSucesso }) {
  const [form, setForm] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",
    complemento: "",
    tipoEndereco: "RESIDENCIAL",
  });
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      setBuscandoCep(true);
      const data = await getAddressByCep(cep);
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        uf: data.estado || "",
      }));
    } catch {
      setErro("CEP não encontrado.");
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async () => {
    setErro("");
    const obrigatorios = ["cep", "logradouro", "bairro", "cidade", "uf", "numero"];
    for (const campo of obrigatorios) {
      if (!form[campo].trim()) {
        setErro("Preencha todos os campos obrigatórios.");
        return;
      }
    }
    try {
      setSalvando(true);
      await lojaAPI.adicionarEndereco(clienteId, form);
      onSucesso();
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
      setErro("Erro ao salvar endereço. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Plus size={18} /> Novo Endereço
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {erro && <p className="modal-erro">{erro}</p>}

          <div className="form-row">
            <label>CEP *</label>
            <div className="input-cep-wrap">
              <input
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
              />
              {buscandoCep && <Loader2 size={16} className="spin cep-loader" />}
            </div>
          </div>

          <div className="form-row">
            <label>Logradouro *</label>
            <input
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              placeholder="Rua, Avenida..."
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label>Número *</label>
              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="123"
              />
            </div>
            <div className="form-row">
              <label>Complemento</label>
              <input
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Apto, Bloco..."
              />
            </div>
          </div>

          <div className="form-row">
            <label>Bairro *</label>
            <input
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              placeholder="Bairro"
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label>Cidade *</label>
              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
              />
            </div>
            <div className="form-row">
              <label>UF *</label>
              <input
                name="uf"
                value={form.uf}
                onChange={handleChange}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>

          <div className="form-row">
            <label>Tipo de Endereço</label>
            <select name="tipoEndereco" value={form.tipoEndereco} onChange={handleChange}>
              <option value="RESIDENCIAL">Residencial</option>
              <option value="COMERCIAL">Comercial</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel-modal" onClick={onClose} disabled={salvando}>
            Cancelar
          </button>
          <button className="btn-salvar" onClick={handleSubmit} disabled={salvando}>
            {salvando ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
            Salvar Endereço
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente Principal ───────────────────────────────────────────────────
export default function LojaPerfil() {
  const { saveLastPath } = useContext(AuthContext);
  const { user, logout } = useModuleAuth("loja");
  const navigate = useNavigate();

  const [modal, setModal] = useState(null); // null | "listar" | "adicionar"

  const handleLogout = () => {
    logout();
    saveLastPath("loja", "/loja/login");
    navigate("/");
  };

const clienteId = user?.clienteId;

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>
          <User /> Perfil
        </h1>
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
              {user?.tipo === "admin" ? (
                <>
                  <UserStar size={16} style={{ marginRight: "6px" }} />
                  Administrador
                </>
              ) : (
                <>
                  <Users size={16} style={{ marginRight: "6px" }} />
                  Cliente
                </>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Data de Cadastro:</span>
            <span className="info-value">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="perfil-card">
          <h2>Endereço de Entrega</h2>

          <button className="btn-action" onClick={() => setModal("adicionar")}>
            <MapPinHouse size={16} /> Adicionar Endereço
          </button>
          <button className="btn-action" onClick={() => setModal("listar")}>
            <NotebookTabs size={16} /> Meus Endereços
          </button>
        </div>

        {user?.tipo === "admin" && (
          <div className="perfil-card admin">
            <h2>⚙️ Painel Administrativo</h2>
            <p>Você tem acesso às ferramentas administrativas da loja.</p>
            <button className="btn-action">
              <NotebookTabs size={16} /> Dashboard Admin
            </button>
          </div>
        )}

        <div className="perfil-card danger">
          <h2>Zona de Perigo</h2>

          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Sair da Conta
          </button>

          <button className="btn-delete">
            <Trash size={16} /> Deletar Conta
          </button>

          <p className="warning-text">
            Atenção: Deletar sua conta é permanente. Todos os dados serão removidos.
          </p>
        </div>
      </div>

      {/* Modais */}
      {modal === "listar" && (
        <ModalListarEnderecos
          clienteId={clienteId}
          onClose={() => setModal(null)}
          onAdicionar={() => setModal("adicionar")}
        />
      )}

      {modal === "adicionar" && (
        <ModalAdicionarEndereco
          clienteId={clienteId}
          onClose={() => setModal(null)}
          onSucesso={() => setModal("listar")}
        />
      )}
    </div>
  );
}