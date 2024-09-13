using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace QLCTAPI.Models;

public partial class QuanLyChiTieuContext : DbContext
{
    public QuanLyChiTieuContext()
    {
    }

    public QuanLyChiTieuContext(DbContextOptions<QuanLyChiTieuContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CategoryDefine> CategoryDefines { get; set; }

    public virtual DbSet<CurrencyDefine> CurrencyDefines { get; set; }

    public virtual DbSet<FrequencyDefine> FrequencyDefines { get; set; }

    public virtual DbSet<PurposeDefine> PurposeDefines { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<TransactionImage> TransactionImages { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserCategoryCustom> UserCategoryCustoms { get; set; }

    public virtual DbSet<UserToken> UserTokens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(Config.ConnectionString);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoryDefine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Category__3214EC27D68F43F9");

            entity.ToTable("CategoryDefine");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ImgSrc).IsUnicode(false);
            entity.Property(e => e.PurposeCode)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CurrencyDefine>(entity =>
        {
            entity.HasKey(e => e.CurrencyCode).HasName("PK__Currency__408426BE281EDBFD");

            entity.ToTable("CurrencyDefine");

            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.BuyRate).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.CurrencyName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SellRate).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Symbol).HasMaxLength(5);
        });

        modelBuilder.Entity<FrequencyDefine>(entity =>
        {
            entity.HasKey(e => e.FrequencyId).HasName("PK__Frequenc__592474B8508E3769");

            entity.ToTable("FrequencyDefine");

            entity.Property(e => e.FrequencyId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FrequencyID");
            entity.Property(e => e.FrequencyName).HasMaxLength(100);
        });

        modelBuilder.Entity<PurposeDefine>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__PurposeD__A25C5AA6464F68FE");

            entity.ToTable("PurposeDefine");

            entity.Property(e => e.Code)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PurposeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Schedule__3214EC27BCE502B0");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryCustomId).HasColumnName("CategoryCustomID");
            entity.Property(e => e.FrequencyId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FrequencyID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Money).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Note).HasMaxLength(1024);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC270D382FE2");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryCustomId).HasColumnName("CategoryCustomID");
            entity.Property(e => e.CreateAt).HasColumnType("datetime");
            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Money).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Note).HasMaxLength(1024);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<TransactionImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC27C0AE8E37");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ImgSrc).HasMaxLength(2048);
            entity.Property(e => e.TransactionId).HasColumnName("TransactionID");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC2797C744F3");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E414313B42").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ID");
            entity.Property(e => e.Balance)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 6)");
            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.NumLoginFail).HasDefaultValue(0);
            entity.Property(e => e.Password).IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UserCategoryCustom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__User_Cat__3214EC27AE62AC9C");

            entity.ToTable("User_Category_Custom");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryColor).HasMaxLength(20);
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CategoryOrder).HasDefaultValue(1);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__UserToke__1788CCAC4FC09D4A");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("UserID");
            entity.Property(e => e.ExpiredDate).HasColumnType("datetime");
            entity.Property(e => e.Token).IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
