package kr.co.iQratorPlus.database.config;
//package kr.co.crawler.database.config;
//
//import javax.sql.DataSource;
//
//import org.apache.ibatis.session.SqlSessionFactory;
//import org.mybatis.spring.SqlSessionFactoryBean;
//import org.mybatis.spring.SqlSessionTemplate;
//import org.mybatis.spring.annotation.MapperScan;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
//
//import com.zaxxer.hikari.HikariConfig;
//import com.zaxxer.hikari.HikariDataSource;
//
///***************************************************
//* This software is the proprietary information of IRSSOFTKOREA
//*
//* Revision History
//* Author             Date       Description
//* ------------------ ---------- -----------------------
//* KimHyeongseok      2023. 04. 19.	HikariCp 사용하여 다중 DB사용 셋팅 두번째 db
//*
//****************************************************/
//
//@Configuration
//@MapperScan(value = "kr.co.iQratorPlus.database.mapper2", sqlSessionFactoryRef = "db2SqlSessionFactory")
//public class Hikari2DataBaseConfig {
//
//    @Bean
//    @Qualifier("db2HikariConfig")
//	@ConfigurationProperties(prefix = "spring.datasource2.hikari")
//	public HikariConfig db2HikariConfig() {
//		return new HikariConfig();
//	}
//	
//	@Bean(name = "db2DataSource")
//	public DataSource dataSource() {
//		return new HikariDataSource(db2HikariConfig());
//	}
//	
//	@Bean(name = "db2SqlSessionFactory")		
//	public SqlSessionFactory sqlSessionFactory(@Qualifier("db2DataSource") DataSource dataSource) throws Exception{
//		final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
//		sessionFactory.setDataSource(dataSource);
//		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
//		sessionFactory.setMapperLocations(resolver.getResources("classpath:mybatis/db2/*/*.xml")); 		//mapper 파일 로드
//		sessionFactory.setConfigLocation(resolver.getResource("classpath:mybatis/mybatis-config.xml")); //mybatis-config 로드
//		return sessionFactory.getObject();
//	}
//	
//	@Bean(name = "db2SqlSessionTemplate")
//	public SqlSessionTemplate sqlSessionTemplate(@Qualifier("db2SqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception{
//		final SqlSessionTemplate sqlSessionTemplate = new SqlSessionTemplate(sqlSessionFactory);
//		return sqlSessionTemplate;
//	}
//}
