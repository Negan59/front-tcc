import React, { useEffect, useState } from 'react';
import { Row, Col, Avatar, Card, Typography, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import './Perfil.css';

const { Title, Text } = Typography;

interface PacienteData {
    id: number;
    nome: string;
    idade: number;
    datanascimento: string | null;
    telefone: string;
    sexo: 'Masculino' | 'Feminino';
    cordapele: string;
    estadocivil: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)';
    responsavel: string;
    profissaoresponsavel: string;
    altura: number;
    peso: number;
    foto: string;
    gmfcs?: string; // Resultado do GMFCS
    macs?: string; // Resultado do MACS
    fms?: string; // Resultado do FMS
}

const Perfil: React.FC = () => {
    const { pacienteId } = useParams<{ pacienteId: string }>();
    const [paciente, setPaciente] = useState<PacienteData | null>(null);
    const [imc, setImc] = useState<number | null>(null);

    const [showGMFCSModal, setShowGMFCSModal] = useState<boolean>(false);
    const [showMACSModal, setShowMACSModal] = useState<boolean>(false);
    const [showFMSModal, setShowFMSModal] = useState<boolean>(false);

    useEffect(() => {
        fetch(`https://tcc-guilherme.azurewebsites.net/api/paciente/${pacienteId}`)
            .then((response) => response.json())
            .then((data) => {
                setPaciente(data);

                if (data.altura && data.peso) {
                    const alturaEmMetros = data.altura / 100;
                    const imcCalculado = data.peso / (alturaEmMetros * alturaEmMetros);
                    setImc(imcCalculado);
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar dados do paciente:', error);
            });
    }, [pacienteId]);

    const getClassificacaoIMC = (imc: number) => {
        if (imc < 18.5) {
            return 'Abaixo do peso';
        } else if (imc < 24.9) {
            return 'Peso normal';
        } else if (imc < 29.9) {
            return 'Sobrepeso';
        } else if (imc < 34.9) {
            return 'Obesidade Grau I';
        } else if (imc < 39.9) {
            return 'Obesidade Grau II';
        } else {
            return 'Obesidade Grau III';
        }
    };

    const handleShowGMFCSModal = () => {
        setShowGMFCSModal(true);
    };

    const handleShowMACSModal = () => {
        setShowMACSModal(true);
    };

    const handleShowFMSModal = () => {
        setShowFMSModal(true);
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={8} style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Avatar
                        size={150}
                        icon={<UserOutlined />}
                        src={`../${paciente?.foto}`}
                        shape="circle"
                    />
                </Col>
                <Col span={16}>
                    <Card>
                        <Title className="nome" level={4}>{paciente?.nome}</Title>
                        <Text><strong>Idade:</strong> {paciente?.idade} anos</Text>
                        <br />
                        <Text><strong>Data de Nascimento:</strong> {paciente?.datanascimento ? moment(paciente?.datanascimento).format('DD/MM/YYYY') : 'N/A'}</Text>
                        <br />
                        <Text><strong>Telefone:</strong> {paciente?.telefone}</Text>
                        <br />
                        <Text><strong>Sexo:</strong> {paciente?.sexo}</Text>
                        <br />
                        <Text><strong>Cor da Pele:</strong> {paciente?.cordapele}</Text>
                        <br />
                        <Text><strong>Estado Civil:</strong> {paciente?.estadocivil}</Text>
                        <br />
                        <Text><strong>Responsável:</strong> {paciente?.responsavel}</Text>
                        <br />
                        <Text><strong>Profissão do Responsável:</strong> {paciente?.profissaoresponsavel}</Text>
                        <br />
                        <Text><strong>Altura:</strong> {paciente?.altura} cm</Text>
                        <br />
                        <Text><strong>Peso:</strong> {paciente?.peso} kg</Text>
                        <br />
                        {imc !== null && (
                            <>
                                <Text><strong>IMC:</strong> {imc.toFixed(2)}</Text>
                                <br />
                                <Text><strong>Classificação do IMC:</strong> {getClassificacaoIMC(imc)}</Text>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Seção GMFCS */}
            <div className="section centered">
                <Title level={3}>GMFCS</Title>
                {paciente?.gmfcs ? (
                    <div>
                        <Text><strong>Resultado:</strong> {paciente?.gmfcs}</Text>
                        <Button onClick={handleShowGMFCSModal}>Editar</Button>
                    </div>
                ) : (
                    <div>
                        <Text>Nenhum resultado disponível.</Text>
                        <Button onClick={handleShowGMFCSModal}>Iniciar Teste</Button>
                    </div>
                )}
            </div>

            {/* Seção MACS */}
            <div className="section centered">
                <Title level={3}>MACS</Title>
                {paciente?.macs ? (
                    <div>
                        <Text><strong>Resultado:</strong> {paciente?.macs}</Text>
                        <Button onClick={handleShowMACSModal}>Editar</Button>
                    </div>
                ) : (
                    <div>
                        <Text>Nenhum resultado disponível.</Text>
                        <Button onClick={handleShowMACSModal}>Iniciar Teste</Button>
                    </div>
                )}
            </div>

            {/* Seção FMS */}
            <div className="section centered">
                <Title level={3}>FMS</Title>
                {paciente?.fms ? (
                    <div>
                        <Text><strong>Resultado:</strong> {paciente?.fms}</Text>
                        <Button onClick={handleShowFMSModal}>Editar</Button>
                    </div>
                ) : (
                    <div>
                        <Text>Nenhum resultado disponível.</Text>
                        <Button onClick={handleShowFMSModal}>Iniciar Teste</Button>
                    </div>
                )}
            </div>

            {/* Modais para GMFCS, MACS e FMS */}
            <Modal
                title="GMFCS - Editar Resultado"
                visible={showGMFCSModal}
                onCancel={() => setShowGMFCSModal(false)}
                // Implemente o conteúdo do modal GMFCS aqui
            />

            <Modal
                title="MACS - Editar Resultado"
                visible={showMACSModal}
                onCancel={() => setShowMACSModal(false)}
                // Implemente o conteúdo do modal MACS aqui
            />

            <Modal
                title="FMS - Editar Resultado"
                visible={showFMSModal}
                onCancel={() => setShowFMSModal(false)}
                // Implemente o conteúdo do modal FMS aqui
            />
        </div>
    );
};

export default Perfil;
