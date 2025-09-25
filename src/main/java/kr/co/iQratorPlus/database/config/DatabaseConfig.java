package kr.co.iQratorPlus.database.config;

//package kr.co.iQratorPlus.database.config;
//
//import org.mybatis.spring.SqlSessionFactoryBean;
//import org.mybatis.spring.annotation.MapperScan;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.jdbc.DataSourceBuilder;
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.apache.ibatis.session.SqlSessionFactory;
//import org.mybatis.spring.SqlSessionTemplate;
//
//import javax.sql.DataSource;
//
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//
//@Configuration
//@MapperScan(value = "kr.co.iQratorPlus.database.mapper", sqlSessionFactoryRef = "db1SqlSessionFactory")
//public class DatabaseConfig {
//	
//	private static final Logger logger = LogManager.getLogger(DatabaseConfig.class);
//	
//	@Bean(name = "db1DataSource")
//	@Primary
//	@ConfigurationProperties(prefix = "spring.db1.datasource")
//	public DataSource db1DataSource() {
//		return DataSourceBuilder.create().build();
//	}
//	
//	@Bean(name = "db1SqlSessionFactory")
//	@Primary
//	public SqlSessionFactory SqlSessionFactory(@Qualifier("db1DataSource") DataSource DataSource,
//			ApplicationContext applicationContext) throws Exception {
//		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
//		sqlSessionFactoryBean.setDataSource(DataSource);
//		sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:mybatis/db1/*/*.xml"));
//		return sqlSessionFactoryBean.getObject();
//
//	}
//	
//	@Bean(name = "db1SqlSessionTemplate")
//	@Primary
//	public SqlSessionTemplate SqlSessionTemplate(SqlSessionFactory SqlSessionFactory) throws Exception {
//		return new SqlSessionTemplate(SqlSessionFactory);
//	}
//}
